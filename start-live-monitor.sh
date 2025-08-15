#!/bin/bash

# Quick live monitoring starter
echo "🔄 STARTING LIVE BUILD MONITORING..."
echo "Checking for new workflow runs every 10 seconds..."
echo "Press Ctrl+C to stop monitoring"
echo

while true; do
    echo "⏰ $(date '+%H:%M:%S') - Checking for new builds..."
    
    # Check for any new in-progress or queued builds
    status=$(curl -s "https://api.github.com/repos/kaulonline/iriseller-mobile/actions/runs?per_page=1" | jq -r '.workflow_runs[0].status')
    
    if [ "$status" == "queued" ] || [ "$status" == "in_progress" ]; then
        echo "🚀 BUILD DETECTED! Starting detailed monitoring..."
        ./monitor-public-build.sh
        break
    fi
    
    sleep 10
done
