// Overload Frontend JavaScript - Live API Integration
const API_BASE_URL = 'https://overload-api.onrender.com';

// DOM Elements
let codeInput, resultsContainer, loadingOverlay;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Get DOM elements
    codeInput = document.getElementById('codeInput');
    resultsContainer = document.getElementById('resultsContainer');
    loadingOverlay = document.getElementById('loadingOverlay');

    // Character counter
    if (codeInput) {
        codeInput.addEventListener('input', updateCharCount);
        updateCharCount();
    }

    // Load example code on page load
    loadExample();

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Circular menu toggle
    const circularBtn = document.getElementById('circularBtn');
    const circularNav = document.querySelector('.circular-nav');
    
    if (circularBtn && circularNav) {
        circularBtn.addEventListener('click', function() {
            circularNav.classList.toggle('active');
            circularBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!circularNav.contains(e.target)) {
                circularNav.classList.remove('active');
                circularBtn.classList.remove('active');
            }
        });
        
        // Close menu when clicking menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                circularNav.classList.remove('active');
                circularBtn.classList.remove('active');
            });
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            analyzeCode();
        }
        
        // Ctrl/Cmd + K to clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            clearCode();
        }
    });
}

function updateCharCount() {
    const charCount = document.querySelector('.char-count');
    if (charCount && codeInput) {
        const count = codeInput.value.length;
        charCount.textContent = `${count} characters`;
        
        // Color coding for length
        if (count > 45000) {
            charCount.style.color = '#ef4444';
        } else if (count > 30000) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#64748b';
        }
    }
}

function scrollToAnalyzer() {
    const analyzer = document.getElementById('analyzer');
    if (analyzer) {
        analyzer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function loadExample() {
    const exampleCode = `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)  # Bug: Division by zero if empty list

def unsafe_eval(user_input):
    return eval(user_input)  # Security vulnerability: Code injection

def process_data(data):
    if data == None:  # Should use 'is None'
        return []
    
    results = []
    for item in data:
        if item > 0:
            results.append(item * 2)
        else:
            results.append(item / 0)  # Runtime error: Division by zero
    
    return results

# Usage with bugs
numbers = []
average = calculate_average(numbers)  # Will crash
print(f"Average: {average}")

user_code = input("Enter code: ")
result = unsafe_eval(user_code)  # Dangerous!

data = None
processed = process_data(data)`;

    if (codeInput) {
        codeInput.value = exampleCode;
        updateCharCount();
    }
}

function clearCode() {
    if (codeInput) {
        codeInput.value = '';
        updateCharCount();
        showPlaceholder();
    }
}

function showPlaceholder() {
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results-placeholder">
                <i class="fas fa-code"></i>
                <p>Enter Python code above and click "Analyze Code" to see results</p>
            </div>
        `;
    }
}

async function analyzeCode() {
    const code = codeInput?.value?.trim();
    
    if (!code) {
        showNotification('Please enter some Python code to analyze', 'warning');
        return;
    }

    if (code.length > 50000) {
        showNotification('Code is too long. Maximum 50,000 characters allowed.', 'error');
        return;
    }

    showLoading(true);
    
    try {
        console.log('Sending request to:', `${API_BASE_URL}/analyze`);
        
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a minute.');
            } else if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Invalid code provided');
            } else if (response.status >= 500) {
                throw new Error('Server error. The service may be starting up. Please try again in 30 seconds.');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const result = await response.json();
        console.log('Analysis result:', result);
        displayResults(result);
        
    } catch (error) {
        console.error('Analysis error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Failed to fetch')) {
            showError('Cannot connect to the API. The service may be starting up. Please wait 30 seconds and try again.');
        } else {
            showError(error.message || 'Analysis failed. Please try again.');
        }
    } finally {
        showLoading(false);
    }
}

function displayResults(result) {
    const bugs = result.bugs || [];
    const analysisTime = result.analysis_time || 0;

    if (bugs.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-issues">
                <div style="text-align: center; padding: 2rem; color: #10b981;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No Issues Found! 🎉</h3>
                    <p>Your code looks clean. No bugs, security issues, or bad practices detected.</p>
                    <small style="color: #64748b;">Analysis completed in ${analysisTime.toFixed(2)}s</small>
                </div>
            </div>
        `;
        return;
    }

    const bugsHtml = bugs.map(bug => `
        <div class="bug-item ${bug.severity}">
            <div class="bug-header">
                <span class="bug-type">${escapeHtml(bug.type)}</span>
                <span class="bug-severity ${bug.severity}">${bug.severity}</span>
            </div>
            ${bug.line ? `<div class="bug-line"><i class="fas fa-map-marker-alt"></i> Line ${bug.line}</div>` : ''}
            <div class="bug-description">${escapeHtml(bug.description)}</div>
            <div class="bug-fix">
                <strong>💡 Fix:</strong> ${escapeHtml(bug.fix)}
            </div>
        </div>
    `).join('');

    const summary = getSummary(bugs);

    resultsContainer.innerHTML = `
        <div class="results-summary">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                <div>
                    <h4 style="margin: 0; color: #1a202c;">Found ${bugs.length} issue${bugs.length !== 1 ? 's' : ''}</h4>
                    <small style="color: #64748b;">Analysis completed in ${analysisTime.toFixed(2)}s</small>
                </div>
                <div style="display: flex; gap: 1rem; font-size: 0.875rem;">
                    ${summary.critical > 0 ? `<span style="color: #dc2626;"><i class="fas fa-exclamation-triangle"></i> ${summary.critical} Critical</span>` : ''}
                    ${summary.high > 0 ? `<span style="color: #ef4444;"><i class="fas fa-exclamation-circle"></i> ${summary.high} High</span>` : ''}
                    ${summary.medium > 0 ? `<span style="color: #f59e0b;"><i class="fas fa-exclamation"></i> ${summary.medium} Medium</span>` : ''}
                    ${summary.low > 0 ? `<span style="color: #10b981;"><i class="fas fa-info-circle"></i> ${summary.low} Low</span>` : ''}
                </div>
            </div>
        </div>
        <div class="bugs-list">
            ${bugsHtml}
        </div>
    `;

    showNotification(`Analysis complete! Found ${bugs.length} issue${bugs.length !== 1 ? 's' : ''}`, 'success');
}

function getSummary(bugs) {
    return bugs.reduce((acc, bug) => {
        acc[bug.severity] = (acc[bug.severity] || 0) + 1;
        return acc;
    }, {});
}

function showError(message) {
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="error-state">
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Analysis Failed</h3>
                    <p>${escapeHtml(message)}</p>
                    <button class="btn btn-primary" onclick="analyzeCode()" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

function showLoading(show) {
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add('show');
        } else {
            loadingOverlay.classList.remove('show');
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    notification.style.background = colors[type] || colors.info;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function exportResults() {
    const bugs = Array.from(document.querySelectorAll('.bug-item')).map(item => {
        const type = item.querySelector('.bug-type')?.textContent || '';
        const severity = item.querySelector('.bug-severity')?.textContent || '';
        const line = item.querySelector('.bug-line')?.textContent?.replace('Line ', '') || '';
        const description = item.querySelector('.bug-description')?.textContent || '';
        const fix = item.querySelector('.bug-fix')?.textContent?.replace('💡 Fix: ', '') || '';
        
        return { type, severity, line, description, fix };
    });

    if (bugs.length === 0) {
        showNotification('No results to export', 'warning');
        return;
    }

    const exportData = {
        timestamp: new Date().toISOString(),
        total_issues: bugs.length,
        code_analyzed: codeInput?.value || '',
        bugs: bugs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overload-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Results exported successfully!', 'success');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Test API connection on page load
window.addEventListener('load', async function() {
    try {
        console.log('Testing API connection...');
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            const health = await response.json();
            console.log('API is healthy:', health);
            showNotification('✅ Connected to Overload API', 'success');
        } else {
            console.warn('API health check failed:', response.status);
            showNotification('⚠️ API may be starting up. Please wait 30 seconds before analyzing.', 'warning');
        }
    } catch (error) {
        console.error('API connection test failed:', error);
        showNotification('⚠️ API connection issue. Service may be starting up.', 'warning');
    }
});