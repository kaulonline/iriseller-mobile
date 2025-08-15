#!/bin/bash

# 🎯 IRISeller Public GitHub Actions Build Monitor
# Real-time monitoring of GitHub Actions builds with live status updates

set -e

# Configuration
REPO="kaulonline/iriseller-mobile"
API_URL="https://api.github.com/repos/$REPO"
ACTIONS_URL="https://github.com/$REPO/actions"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}📱 IRISeller iOS Build Monitor - LIVE TRACKING${NC}"
    echo "=================================================="
    echo
}

print_status() {
    echo -e "${CYAN}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${PURPLE}🔍 $1${NC}"
}

get_latest_workflow_run() {
    curl -s "${API_URL}/actions/runs?per_page=1" | \
    jq -r '.workflow_runs[0] | "\(.id) \(.status) \(.conclusion) \(.head_sha) \(.html_url)"'
}

get_workflow_jobs() {
    local run_id=$1
    curl -s "${API_URL}/actions/runs/${run_id}/jobs" | \
    jq -r '.jobs[] | "\(.name) \(.status) \(.conclusion) \(.started_at) \(.completed_at)"'
}

format_duration() {
    local start_time=$1
    local end_time=$2
    
    if [ "$start_time" == "null" ] || [ "$end_time" == "null" ]; then
        echo "N/A"
        return
    fi
    
    local start_epoch=$(date -d "$start_time" +%s 2>/dev/null || echo "0")
    local end_epoch=$(date -d "$end_time" +%s 2>/dev/null || echo "0")
    
    if [ "$end_epoch" -gt "$start_epoch" ]; then
        local duration=$((end_epoch - start_epoch))
        local minutes=$((duration / 60))
        local seconds=$((duration % 60))
        echo "${minutes}m ${seconds}s"
    else
        echo "Calculating..."
    fi
}

monitor_build() {
    print_header
    
    # Get current commit info
    local current_commit=$(git rev-parse --short HEAD)
    local commit_message=$(git log -1 --pretty=format:'%s')
    
    print_info "Repository: https://github.com/$REPO"
    print_info "Latest Commit: $current_commit - $commit_message"
    print_info "Actions URL: $ACTIONS_URL"
    echo
    
    print_status "Fetching latest workflow run..."
    
    # Get latest workflow run
    local workflow_info=$(get_latest_workflow_run)
    
    if [ -z "$workflow_info" ] || [ "$workflow_info" == "null null null null null" ]; then
        print_error "No workflow runs found or repository not accessible"
        echo
        echo "📋 Make sure:"
        echo "  • Repository is public"
        echo "  • At least one workflow run exists"
        echo "  • GitHub API is accessible"
        return 1
    fi
    
    read -r run_id status conclusion commit_sha run_url <<< "$workflow_info"
    
    echo "🎯 WORKFLOW RUN DETAILS:"
    echo "  ID: $run_id"
    echo "  Commit: $commit_sha"
    echo "  URL: $run_url"
    echo
    
    # Monitor until completion
    local last_status=""
    while true; do
        # Get current workflow status
        local current_info=$(get_latest_workflow_run)
        read -r current_run_id current_status current_conclusion current_commit current_url <<< "$current_info"
        
        # Check if this is a different run (newer commit)
        if [ "$current_run_id" != "$run_id" ]; then
            print_warning "New workflow run detected! Switching to run ID: $current_run_id"
            run_id=$current_run_id
            status=$current_status
            conclusion=$current_conclusion
            commit_sha=$current_commit
            run_url=$current_url
        else
            status=$current_status
            conclusion=$current_conclusion
        fi
        
        # Print status update if changed
        if [ "$status" != "$last_status" ]; then
            case $status in
                "queued")
                    print_warning "⏳ Build is QUEUED - waiting for runner..."
                    ;;
                "in_progress")
                    print_status "🚀 Build is IN PROGRESS - compiling iOS app..."
                    ;;
                "completed")
                    case $conclusion in
                        "success")
                            print_success "🎉 BUILD SUCCESSFUL! iOS app compiled successfully!"
                            print_success "📱 IRISeller.ipa should be available in artifacts!"
                            ;;
                        "failure")
                            print_error "💥 Build FAILED - check logs for details"
                            ;;
                        "cancelled")
                            print_warning "⚠️  Build was CANCELLED"
                            ;;
                        *)
                            print_warning "📋 Build completed with status: $conclusion"
                            ;;
                    esac
                    break
                    ;;
                *)
                    print_info "📋 Status: $status"
                    ;;
            esac
            last_status=$status
        fi
        
        # Get and display job details if build is running
        if [ "$status" == "in_progress" ]; then
            echo
            print_info "JOB DETAILS:"
            get_workflow_jobs $run_id | while IFS=' ' read -r job_name job_status job_conclusion job_start job_end; do
                local duration=$(format_duration "$job_start" "$job_end")
                case $job_status in
                    "in_progress")
                        print_status "  🔄 $job_name - Running ($duration)"
                        ;;
                    "completed")
                        if [ "$job_conclusion" == "success" ]; then
                            print_success "  ✅ $job_name - Completed ($duration)"
                        else
                            print_error "  ❌ $job_name - Failed ($duration)"
                        fi
                        ;;
                    "queued")
                        print_warning "  ⏳ $job_name - Queued"
                        ;;
                    *)
                        print_info "  📋 $job_name - $job_status"
                        ;;
                esac
            done
            echo
        fi
        
        # Wait before next check
        if [ "$status" != "completed" ]; then
            sleep 30  # Check every 30 seconds
            echo -ne "\r⏰ $(date '+%H:%M:%S') - Checking build status...           "
        fi
    done
    
    echo
    echo "=================================================="
    print_info "Build monitoring complete!"
    print_info "View full logs: $run_url"
    echo
    
    if [ "$conclusion" == "success" ]; then
        echo "🎯 NEXT STEPS:"
        echo "  1. Download .ipa file from GitHub Actions artifacts"
        echo "  2. Run: ./deploy-ipa.sh /path/to/IRISeller.ipa"
        echo "  3. Test: https://app.iriseller.com/ios-enterprise/install.html"
        echo "  4. 🎉 Install on iPhone!"
    else
        echo "🛠️  DEBUGGING:"
        echo "  1. Check build logs at: $run_url"
        echo "  2. Review error messages"
        echo "  3. Apply fixes and push new commit"
        echo "  4. Monitor next build with this script"
    fi
}

# Main execution
if ! command -v jq &> /dev/null; then
    print_error "jq is required for JSON parsing"
    echo "Install with: sudo apt-get install jq"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    print_error "curl is required for API calls"
    echo "Install with: sudo apt-get install curl"
    exit 1
fi

# Check if we can access the GitHub API
print_status "Checking repository accessibility..."
if ! curl -s "$API_URL" | jq -r '.name' > /dev/null 2>&1; then
    print_error "Cannot access repository via GitHub API"
    echo
    echo "📋 Possible issues:"
    echo "  • Repository is still private"
    echo "  • Repository name incorrect"
    echo "  • GitHub API is down"
    echo "  • Network connectivity issue"
    echo
    echo "🔧 Make repository public:"
    echo "  1. Go to: https://github.com/$REPO/settings"
    echo "  2. Scroll to 'Danger Zone'"
    echo "  3. Click 'Change visibility'"
    echo "  4. Select 'Make public'"
    exit 1
fi

print_success "Repository is accessible! Starting monitoring..."
echo

monitor_build
