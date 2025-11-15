#!/bin/bash

# Configuration
START=270      # Starting point (HEAD~270)
END=0          # End point (HEAD)
BATCH_SIZE=10  # Push 10 commits at a time
REMOTE="gitea"
BRANCH="main"

echo "Starting incremental push from HEAD~$START to HEAD"
echo "Batch size: $BATCH_SIZE commits"
echo "========================================="

# Push from HEAD~270 down to HEAD in batches
for ((i=$START; i>=$END; i-=$BATCH_SIZE)); do
    if [ $i -le 0 ]; then
        # Final push to HEAD
        echo ""
        echo "📤 Pushing final batch to HEAD (all 334 commits)..."
        git push $REMOTE HEAD:refs/heads/$BRANCH
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully pushed to HEAD!"
        else
            echo "❌ Failed to push to HEAD"
            exit 1
        fi
    else
        # Push intermediate batch
        echo ""
        echo "📤 Pushing up to HEAD~$i (approximately $(($START - $i)) commits pushed so far)..."
        git push $REMOTE HEAD~$i:refs/heads/$BRANCH
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully pushed to HEAD~$i"
        else
            echo "❌ Failed at HEAD~$i. Try reducing BATCH_SIZE."
            echo "To resume, edit the script and set START=$i"
            exit 1
        fi
        
        # Small delay to avoid overwhelming the server
        sleep 1
    fi
done

echo ""
echo "========================================="
echo "🎉 All commits pushed successfully!"
echo "Your repository is now up to date on Gitea."

