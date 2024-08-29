#!/bin/bash

# Logging the start of the script
echo "Running preinstall script for Tiptap Pro authentication..."

# Check if TIPTAP_TOKEN is set
if [ -z "$TIPTAP_TOKEN" ]; then
  echo "Error: TIPTAP_TOKEN is not set. Please make sure the TIPTAP_TOKEN environment variable is available."
  exit 1
else
  echo "TIPTAP_TOKEN is set."
fi

# Define the path to the .npmrc file
NPMRC_FILE=".npmrc"

# Create or update the .npmrc file
echo "Configuring .npmrc for Tiptap Pro authentication..."
{
  echo "@tiptap-pro:registry=https://registry.tiptap.dev/"
  echo "//registry.tiptap.dev/:_authToken=${TIPTAP_TOKEN}"
} > "$NPMRC_FILE"

# Log the contents of the .npmrc file for debugging
echo ".npmrc file content:"
cat "$NPMRC_FILE"

# Logging the completion of the script
echo "Preinstall script completed successfully."
