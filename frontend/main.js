// Configuration for different environments
const CONFIG = {
    // Backend API URL - will be updated to your deployed backend URL
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://your-backend-app.onrender.com', // Replace with your actual backend URL
    
    // API endpoints
    ENDPOINTS: {
        ANALYZE: '/api/analyze',
        HEALTH: '/api/health'
    }
};

// Global variables
let currentTab = 'text';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    checkSystemHealth();
});

function initializeApp() {
    // Initialize tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabType = this.onclick.toString().match(/switchTab\('(\w+)'\)/)[1];
            switchTab(tabType);
        });
    });

    // Initialize analyze button
    const analyzeBtn = document.querySelector('.analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeNews);
        
        // Add hover effects
        analyzeBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        analyzeBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
    
    // Show a welcome message
    setTimeout(() => {
        if (typeof showAlert === 'function') {
            showAlert('Welcome to AI Fake News Detection System! 🎉', 'success');
        }
    }, 1000);
}

// Check system health and API connectivity
async function checkSystemHealth() {
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.HEALTH}`, {
            method: 'GET',
            timeout: 10000
        });
        
        if (response.ok) {
            const data = await response.json();
            statusIcon.className = 'fas fa-circle text-success';
            statusText.textContent = 'System Online';
            statusIcon.style.color = '#28a745';
        } else {
            throw new Error('Health check failed');
        }
    } catch (error) {
        console.error('System health check failed:', error);
        statusIcon.className = 'fas fa-circle text-danger';
        statusText.textContent = 'System Offline';
        statusIcon.style.color = '#dc3545';
        
        showAlert('Backend system is currently offline. Please try again later.', 'warning');
    }
}

// Switch between input tabs
function switchTab(tabType) {
    currentTab = tabType;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-button').classList.add('active');
    
    // Update input panels
    document.querySelectorAll('.input-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    document.getElementById(`${tabType}-tab`).classList.remove('hidden');
}

// Validate URL format
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Main analysis function
async function analyzeNews() {
    const button = document.querySelector('.analyze-btn');
    const btnIcon = document.querySelector('.btn-icon');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const resultsContainer = document.getElementById('results');
    
    // Get input values based on current tab
    let content = '';
    let inputType = currentTab;
    
    if (currentTab === 'text') {
        content = document.getElementById('news-text').value.trim();
        if (!content) {
            showAlert('Please enter some text to analyze.', 'warning');
            return;
        }
    } else {
        content = document.getElementById('news-url').value.trim();
        if (!content) {
            showAlert('Please enter a URL to analyze.', 'warning');
            return;
        }
        if (!isValidURL(content)) {
            showAlert('Please enter a valid URL.', 'warning');
            return;
        }
    }
    
    // Get analysis options
    const verifySourcesChecked = document.getElementById('verify-sources').checked;
    const detailedAnalysisChecked = document.getElementById('detailed-analysis').checked;
    
    // Show loading state
    button.disabled = true;
    button.classList.add('loading');
    btnIcon.style.display = 'none';
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    resultsContainer.classList.add('hidden');
    
    try {
        // Prepare request data based on expected backend format
        const requestData = {
            text: currentTab === 'text' ? content : undefined,
            url: currentTab === 'url' ? content : undefined,
            ai_analysis: detailedAnalysisChecked,
            find_sources: verifySourcesChecked
        };
        
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ANALYZE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayResults(result);
        } else {
            showAlert(result.error || 'Analysis failed. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('Failed to fetch')) {
            showAlert('Cannot connect to analysis server. Please check if the backend is running and try again.', 'error');
        } else {
            showAlert('Failed to analyze content. Please check your connection and try again.', 'error');
        }
    } finally {
        // Reset button state
        button.disabled = false;
        button.classList.remove('loading');
        btnIcon.style.display = 'block';
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

// Display analysis results
function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    
    // Extract analysis data
    const analysis = data.analysis || {};
    const realTimeVerification = data.real_time_verification || {};
    
    let html = `
        <div class="results-header">
            <h3><i class="fas fa-chart-line"></i> Analysis Results</h3>
            <div class="analysis-summary">
                <div class="credibility-score ${getScoreClass(analysis.final_score || 0.5)}">
                    <div class="score-circle">
                        <span class="score-number">${Math.round((analysis.final_score || 0.5) * 100)}%</span>
                    </div>
                    <div class="score-label">${analysis.final_assessment || 'Unknown'}</div>
                </div>
            </div>
        </div>
    `;

    // Real-time verification results
    if (realTimeVerification && realTimeVerification.success) {
        html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #155724;">
                    <i class="fas fa-search" style="color: #28a745;"></i>
                    Real-Time Fact Verification
                </h4>
                <div class="verification-summary" style="margin-bottom: 1rem;">
                    <p style="font-size: 1rem; margin-bottom: 0.5rem;">
                        <strong>Claims Checked:</strong> ${realTimeVerification.claims_checked}
                    </p>
                    <p style="font-size: 1rem; margin-bottom: 0.5rem;">
                        <strong>Verification Score:</strong> ${Math.round(realTimeVerification.overall_credibility_score * 100)}%
                    </p>
                    <p style="font-size: 0.95rem; color: #155724;">
                        ${realTimeVerification.summary}
                    </p>
                </div>
                
                ${realTimeVerification.verifications && realTimeVerification.verifications.length > 0 ? `
                <div class="claims-details" style="margin-top: 1rem;">
                    <h5 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem;">Individual Claim Verifications:</h5>
                    ${realTimeVerification.verifications.map((verification, index) => `
                        <div class="claim-item" style="background: white; border: 1px solid #c3e6cb; border-radius: 6px; padding: 1rem; margin-bottom: 0.75rem;">
                            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                Claim ${index + 1}: "${verification.claim?.substring(0, 100)}${verification.claim?.length > 100 ? '...' : ''}"
                            </div>
                            <div style="margin-bottom: 0.5rem;">
                                <span style="font-weight: 500;">Status:</span> 
                                <span style="color: ${getVerificationColor(verification.verification_status)}; font-weight: 600;">
                                    ${verification.verification_status || 'Unknown'}
                                </span>
                                <span style="margin-left: 1rem; font-weight: 500;">Confidence:</span> 
                                <span style="font-weight: 600;">${Math.round((verification.confidence_score || 0) * 100)}%</span>
                            </div>
                            ${verification.explanation ? `
                            <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                                <strong>Explanation:</strong> ${verification.explanation}
                            </div>` : ''}
                        </div>
                    `).join('')}
                </div>` : ''}
            </div>
        `;
    } else if (realTimeVerification && !realTimeVerification.success) {
        html += `
        <div class="analysis-card" style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
            <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #856404;">
                <i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i>
                Real-Time Verification Unavailable
            </h4>
            <p style="color: #856404;">
                ${realTimeVerification.error || 'Real-time fact checking could not be performed. Please check API configuration.'}
            </p>
        </div>`;
    }
        
    html += `
        <div class="analysis-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-robot" style="color: var(--primary-color);"></i>
                    ML Analysis
                </h4>
                <p style="margin-bottom: 0.5rem;">
                    <strong>Prediction:</strong> ${analysis.ml_result?.prediction || 'Unknown'}
                </p>
                <p style="margin-bottom: 0.5rem;">
                    <strong>Confidence:</strong> ${Math.round((analysis.ml_result?.confidence || 0.5) * 100)}%
                </p>
                ${analysis.factual_boost > 0 ? `
                <p style="color: #17a2b8; font-size: 0.9em; margin-bottom: 0.5rem;">
                    <i class="fas fa-arrow-up"></i> Factual statement boost applied
                </p>` : ''}
                ${analysis.adjusted_by_real_time ? `
                <p style="color: #17a2b8; font-size: 0.9em; margin-bottom: 0.5rem;">
                    <i class="fas fa-sync"></i> Enhanced by real-time verification
                </p>` : ''}
                <div class="score-bar" style="height: 8px; background: var(--gray-200); border-radius: 4px; margin-top: 0.75rem; overflow: hidden;">
                    <div class="score-fill" style="height: 100%; background: var(--primary-gradient); border-radius: 4px; width: ${(analysis.credibility_score || 0.5) * 100}%; transition: width 0.8s ease;"></div>
                </div>
            </div>`;

    // Add real-time verification score card if available
    if (realTimeVerification && realTimeVerification.success && realTimeVerification.overall_credibility_score !== undefined) {
        html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-search-plus" style="color: #28a745;"></i>
                    Real-Time Verification
                </h4>
                <p style="margin-bottom: 0.5rem;">Verification Score: ${Math.round(realTimeVerification.overall_credibility_score * 100)}%</p>
                <p style="margin-bottom: 0.5rem;">Claims Verified: ${realTimeVerification.claims_checked}</p>
                <p style="color: #28a745; font-size: 0.9em; margin-bottom: 0.5rem;">
                    <i class="fas fa-globe"></i> Live fact-checking enabled
                </p>
                <div class="score-bar" style="height: 8px; background: var(--gray-200); border-radius: 4px; margin-top: 0.75rem; overflow: hidden;">
                    <div class="score-fill" style="height: 100%; background: linear-gradient(135deg, #28a745, #20c997); border-radius: 4px; width: ${realTimeVerification.overall_credibility_score * 100}%; transition: width 0.8s ease;"></div>
                </div>
            </div>`;
    }

    // Content Quality Analysis
    html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-file-alt" style="color: var(--success-color);"></i>
                    Content Quality
                </h4>
                <p style="margin-bottom: 0.5rem;">Quality Score: ${Math.round((analysis.content_quality || 0.7) * 100)}%</p>
                <p style="margin-bottom: 0.5rem;">Assessment: Good</p>
                <p style="color: #28a745; font-size: 0.9em; margin-bottom: 0.5rem;">
                    <i class="fas fa-check"></i> Standard content quality
                </p>
                <div class="score-bar" style="height: 8px; background: var(--gray-200); border-radius: 4px; margin-top: 0.75rem; overflow: hidden;">
                    <div class="score-fill" style="height: 100%; background: var(--success-gradient); border-radius: 4px; width: 75%; transition: width 0.8s ease;"></div>
                </div>
            </div>
        </div>`;

    // API Status section
    if (data.api_status) {
        html += `
        <div class="api-status-section" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
            <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                <i class="fas fa-cogs" style="color: var(--primary-color);"></i>
                System Capabilities
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-${data.api_status.gemini_ai ? 'check' : 'times'}" style="color: ${data.api_status.gemini_ai ? '#28a745' : '#dc3545'};"></i>
                    <span>Gemini AI</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-${data.api_status.search_api ? 'check' : 'times'}" style="color: ${data.api_status.search_api ? '#28a745' : '#dc3545'};"></i>
                    <span>Search API</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-${data.features_enabled.real_time_verification ? 'check' : 'times'}" style="color: ${data.features_enabled.real_time_verification ? '#28a745' : '#dc3545'};"></i>
                    <span>Real-Time Verification</span>
                </div>
            </div>
        </div>`;
    }

    // Add AI Insights if available
    if (data.ai_insights) {
        html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-lightbulb" style="color: var(--accent-color);"></i>
                    AI Insights
                </h4>
                <div style="margin-bottom: 1rem;">
                    <strong style="color: var(--gray-700);">Summary:</strong>
                    <p style="margin-top: 0.25rem; color: var(--gray-600);">${data.ai_insights.summary}</p>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong style="color: var(--gray-700);">Assessment:</strong>
                    <p style="margin-top: 0.25rem; color: var(--gray-600);">${data.ai_insights.credibility_assessment}</p>
                </div>
                <div>
                    <strong style="color: var(--gray-700);">Reasoning:</strong>
                    <p style="margin-top: 0.25rem; color: var(--gray-600);">${data.ai_insights.fact_check_reasoning}</p>
                </div>
            </div>
        `;
    }

    // Fact Verification section
    if (data.fact_verification) {
        const factScore = data.fact_verification.factual_score || 0.7;
        const factColor = factScore > 0.7 ? '#28a745' : factScore > 0.5 ? '#ffc107' : '#dc3545';
        
        html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle" style="color: ${factColor};"></i>
                    Fact Verification
                </h4>
                <div style="margin-bottom: 1rem;">
                    <strong style="color: var(--gray-700);">Factual Score:</strong>
                    <span style="color: ${factColor}; font-weight: 600; margin-left: 0.5rem;">${Math.round(factScore * 100)}%</span>
                    <div class="score-bar" style="height: 6px; background: var(--gray-200); border-radius: 5px; margin-top: 0.5rem; overflow: hidden;">
                        <div class="score-fill" style="height: 100%; background: ${factColor}; border-radius: 5px; width: ${factScore * 100}%; transition: width 0.8s ease;"></div>
                    </div>
                </div>
                ${data.fact_verification.reasoning ? `
                <div>
                    <strong style="color: var(--gray-700);">Verification Analysis:</strong>
                    <p style="margin-top: 0.25rem; color: var(--gray-600); font-style: italic;">${data.fact_verification.reasoning}</p>
                </div>` : ''}
            </div>
        `;
    }
    
    // Add Related Sources if available
    if (data.related_sources && data.related_sources.success && data.related_sources.sources && data.related_sources.sources.length > 0) {
        html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-newspaper" style="color: var(--primary-color);"></i>
                    Related Sources for Verification
                </h4>
                <p style="margin-bottom: 1rem; color: var(--gray-600);">
                    Cross-check this story with these related sources:
                </p>
                <div class="sources-grid" style="display: grid; gap: 1rem;">
        `;
        
        data.related_sources.sources.forEach((source, index) => {
            let sourceUrl = source.url;
            if (sourceUrl && !sourceUrl.startsWith('http')) {
                sourceUrl = 'https://' + sourceUrl;
            }
            
            const trustBadge = source.is_trusted ? 
                '<span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check"></i> Trusted</span>' : 
                '<span style="background: var(--gray-400); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-newspaper"></i> News</span>';
            
            const credibilityColor = source.credibility_score > 0.8 ? '#28a745' : 
                                   source.credibility_score > 0.6 ? '#ffc107' : '#6c757d';
            
            const title = source.title || `Article from ${source.source}`;
            const displayUrl = sourceUrl || '#';
            
            html += `
                <div class="source-item" style="background: white; border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 1rem; transition: all 0.2s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 1rem;">
                        <h5 style="margin: 0; font-size: 0.95rem; line-height: 1.4; flex: 1;">
                            <a href="${displayUrl}" target="_blank" rel="noopener noreferrer" 
                               style="color: var(--primary-color); text-decoration: none; font-weight: 500;"
                               title="Open ${title} in new tab">
                                ${title}
                            </a>
                        </h5>
                        ${trustBadge}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--gray-500);">
                        <span style="font-weight: 600;">
                            <i class="fas fa-globe"></i> ${source.source || source.domain}
                        </span>
                        <span style="color: ${credibilityColor}; font-weight: 500;">
                            Credibility: ${Math.round(source.credibility_score * 100)}%
                        </span>
                    </div>
                    ${source.snippet ? `<p style="font-size: 0.85rem; line-height: 1.4; color: var(--gray-600); margin: 0; border-left: 2px solid var(--gray-300); padding-left: 0.75rem;">${source.snippet}</p>` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
                <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--gray-500); text-align: center;">
                    <i class="fas fa-info-circle"></i> Click on any source above to read the full article and verify information accuracy
                </div>
            </div>
        `;
    } else if (document.getElementById('verify-sources').checked) {
        // Show message if source verification was requested but failed
        const searchText = currentTab === 'text' ? document.getElementById('news-text').value.substring(0, 100) : '';
        html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-search" style="color: var(--warning-color);"></i>
                    Source Verification
                </h4>
                <p style="color: #856404; background: #fff3cd; padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i> Unable to find related sources at this time. You can manually search for this topic on:
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="https://www.reuters.com/search/news?blob=${encodeURIComponent(searchText)}" 
                       target="_blank" rel="noopener noreferrer" 
                       style="color: var(--primary-color); text-decoration: none; font-weight: 500;">
                        <i class="fas fa-external-link-alt"></i> Reuters
                    </a>
                    <a href="https://www.bbc.com/search?q=${encodeURIComponent(searchText)}" 
                       target="_blank" rel="noopener noreferrer" 
                       style="color: var(--primary-color); text-decoration: none; font-weight: 500;">
                        <i class="fas fa-external-link-alt"></i> BBC News
                    </a>
                    <a href="https://apnews.com/search?q=${encodeURIComponent(searchText)}" 
                       target="_blank" rel="noopener noreferrer" 
                       style="color: var(--primary-color); text-decoration: none; font-weight: 500;">
                        <i class="fas fa-external-link-alt"></i> AP News
                    </a>
                </div>
            </div>
        `;
    }
    
    // Add analysis timestamp
    html += `
        <div style="text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200); color: var(--gray-500); font-size: 0.9rem;">
            <i class="fas fa-clock"></i> Analysis completed at ${new Date().toLocaleString()}
        </div>
    `;
    
    // Update the results content and show the results section
    resultsContent.innerHTML = html;
    resultsContainer.classList.remove('hidden');
    
    // Smooth scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Animate score bars
    setTimeout(() => {
        const scoreFills = document.querySelectorAll('.score-fill');
        scoreFills.forEach(fill => {
            fill.style.opacity = '1';
        });
    }, 500);
}

// Helper functions
function getScoreClass(score) {
    if (score >= 0.8) return 'high-credibility';
    if (score >= 0.6) return 'moderate-credibility';
    if (score >= 0.4) return 'low-credibility';
    return 'very-low-credibility';
}

function getVerificationColor(status) {
    switch (status) {
        case 'TRUE': return '#28a745';
        case 'PARTIALLY_TRUE': return '#ffc107';
        case 'FALSE': return '#dc3545';
        default: return '#6c757d';
    }
}

// Alert system
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    const alertId = 'alert-' + Date.now();
    const alertElement = document.createElement('div');
    alertElement.id = alertId;
    alertElement.className = `alert alert-${type}`;
    alertElement.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="closeAlert('${alertId}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    alertContainer.appendChild(alertElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        closeAlert(alertId);
    }, 5000);
}

function getAlertIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

function closeAlert(alertId) {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
        alertElement.style.opacity = '0';
        alertElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (alertElement && alertElement.parentNode) {
                alertElement.parentNode.removeChild(alertElement);
            }
        }, 300);
    }
}

// Demo function for testing (can be removed in production)
function testDemo() {
    const demoText = "Breaking: Scientists discover new method to detect misinformation using advanced AI algorithms and machine learning techniques.";
    document.getElementById('news-text').value = demoText;
    if (typeof showAlert === 'function') {
        showAlert('Demo text loaded! Click "Analyze News Article" to test the system.', 'info');
    }
}

// Add demo button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create a demo button
    const demoBtn = document.createElement('button');
    demoBtn.innerHTML = '🎭 Load Demo Text';
    demoBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        padding: 0.5rem 1rem;
        background: #17a2b8;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    demoBtn.onclick = testDemo;
    document.body.appendChild(demoBtn);
});
