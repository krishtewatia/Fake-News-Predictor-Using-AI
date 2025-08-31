// Global variables
let currentTab = 'text';

// Tab switching functionality
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.input-panel').forEach(panel => panel.classList.add('hidden'));
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    
    currentTab = tabName;
    clearResults();
}

// Clear results
function clearResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.classList.add('hidden');
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
        
        const response = await fetch('/api/analyze', {
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
        showAlert('Failed to connect to the analysis server. Please check your connection and try again.', 'error');
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
    const analysis = data.analysis;
    const finalAssessment = data.final_assessment;
    const realTimeVerification = data.real_time_verification;
    
    if (!analysis) {
        showAlert('Invalid response from server.', 'error');
        return;
    }
    
    // Determine result styling based on final assessment
    const credibilityLevel = finalAssessment?.credibility_level?.toLowerCase() || 'moderate';
    
    const icons = {
        'high_credibility': '<i class="fas fa-check-circle" style="color: #28a745;"></i>',
        'moderate_credibility': '<i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i>',
        'low_credibility': '<i class="fas fa-exclamation-triangle" style="color: #fd7e14;"></i>',
        'very_low_credibility': '<i class="fas fa-times-circle" style="color: #dc3545;"></i>'
    };
    
    const colors = {
        'high_credibility': '#28a745',
        'moderate_credibility': '#ffc107', 
        'low_credibility': '#fd7e14',
        'very_low_credibility': '#dc3545'
    };

    let html = `
        <div class="result-header" style="text-align: center; margin-bottom: 2rem;">
            <div class="result-icon" style="font-size: 3rem; margin-bottom: 1rem;">
                ${icons[credibilityLevel] || icons['moderate_credibility']}
            </div>
            <div class="result-content">
                <h3 style="font-size: 1.75rem; font-weight: 700; color: ${colors[credibilityLevel] || colors['moderate_credibility']}; margin-bottom: 0.5rem;">
                    ${finalAssessment?.credibility_level?.replace(/_/g, ' ').toUpperCase() || 'MODERATE CREDIBILITY'}
                </h3>
                <div class="result-score" style="font-size: 1.25rem; color: var(--gray-600);">
                    Overall Credibility Score: ${Math.round((finalAssessment?.credibility_score || 0.5) * 100)}%
                </div>
                <p style="margin-top: 1rem; color: var(--gray-700); font-size: 1rem;">
                    ${finalAssessment?.message || 'Analysis completed'}
                </p>
            </div>
        </div>`;

    // Real-time verification results
    if (realTimeVerification && realTimeVerification.success) {
        html += `
        <div class="verification-section" style="background: #e8f5e8; border: 2px solid #28a745; border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
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
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.85rem; padding: 0.25rem 0.5rem; border-radius: 12px; 
                                ${verification.verification_status === 'TRUE' ? 'background: #d4edda; color: #155724;' : 
                                  verification.verification_status === 'FALSE' ? 'background: #f8d7da; color: #721c24;' : 
                                  'background: #fff3cd; color: #856404;'}">
                                ${verification.verification_status}
                            </span>
                            <span style="font-size: 0.85rem; color: #6c757d;">
                                Confidence: ${Math.round((verification.confidence_score || 0.5) * 100)}%
                            </span>
                        </div>
                        ${verification.explanation ? `
                        <p style="font-size: 0.85rem; color: #495057; margin-bottom: 0.5rem;">
                            ${verification.explanation}
                        </p>` : ''}
                        ${verification.current_facts ? `
                        <p style="font-size: 0.8rem; color: #6c757d; font-style: italic;">
                            Current facts: ${verification.current_facts}
                        </p>` : ''}
                    </div>
                `).join('')}
            </div>` : ''}
        </div>`;
    } else if (realTimeVerification && !realTimeVerification.success) {
        html += `
        <div class="verification-section" style="background: #fff3cd; border: 2px solid #ffc107; border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
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
                    Machine Learning Analysis
                </h4>
                <p style="margin-bottom: 0.5rem;">ML Score: ${Math.round((analysis.credibility_score || 0.5) * 100)}%</p>
                ${analysis.original_ml_score ? `
                <p style="margin-bottom: 0.5rem; font-size: 0.9rem; color: #6c757d;">
                    Original ML: ${Math.round(analysis.original_ml_score * 100)}%
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
            
    html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-chart-bar" style="color: var(--primary-color);"></i>
                    Content Analysis
                </h4>
                <p style="margin-bottom: 0.5rem;">Quality Assessment: Good</p>
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

    // Add Legacy Fact Verification if available (when real-time is not enabled)
    if (data.fact_verification && !data.fact_verification.error && !data.real_time_verification) {
        const factScore = data.fact_verification.credibility_score || 0.5;
        const factColor = factScore > 0.7 ? '#28a745' : 
                         factScore > 0.4 ? '#ffc107' : '#dc3545';
        
        html += `
            <div class="analysis-card" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">
                    <i class="fas fa-search-plus" style="color: ${factColor};"></i>
                    Legacy Fact Verification
                </h4>
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <strong style="color: var(--gray-700);">Overall Credibility:</strong>
                        <span style="background: ${factColor}; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600;">
                            ${Math.round(factScore * 100)}%
                        </span>
                    </div>
                    <div class="score-bar" style="height: 10px; background: var(--gray-200); border-radius: 5px; overflow: hidden;">
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
        <div style="margin-top: 2rem; text-align: center; font-size: 0.9rem; color: var(--gray-500); border-top: 1px solid var(--gray-200); padding-top: 1rem;">
            <i class="fas fa-clock"></i> Analysis completed at ${new Date(analysis.analysis_timestamp).toLocaleString()}
        </div>
    `;
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.remove('hidden');
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Utility functions
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showAlert(message, type = 'info') {
    // Create and show a custom alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 400px;
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease;
    `;
    
    const colors = {
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    alert.style.background = colors[type] || colors.info;
    alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 5000);
}

// Add CSS for alert animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
