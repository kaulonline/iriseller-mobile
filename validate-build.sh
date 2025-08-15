#!/bin/bash

# 🎯 IRISeller Build Validation Script
# Proactively validates all build configurations before pushing

set -e  # Exit on any error

echo "🔍 IRISeller Build Configuration Validator"
echo "=========================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}📋 $1${NC}"
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

# Validation functions
validate_eas_json() {
    print_status "Validating eas.json configuration..."
    
    if ! command -v eas &> /dev/null; then
        print_warning "EAS CLI not installed locally - installing..."
        npm install -g eas-cli
    fi
    
    # Validate eas.json syntax and structure
    if eas config --check &> /dev/null; then
        print_success "eas.json is valid"
    else
        print_error "eas.json validation failed"
        eas config --check
        return 1
    fi
}

validate_package_json() {
    print_status "Validating package.json..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        return 1
    fi
    
    # Check if package.json is valid JSON
    if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
        print_success "package.json is valid JSON"
    else
        print_error "package.json is invalid JSON"
        return 1
    fi
    
    # Check for required dependencies
    if node -e "
        const pkg = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
        const deps = {...(pkg.dependencies || {}), ...(pkg.devDependencies || {})};
        if (!deps['expo']) throw new Error('Missing expo dependency');
        if (!deps['react-native']) throw new Error('Missing react-native dependency');
        console.log('Required dependencies found');
    " 2>/dev/null; then
        print_success "Required dependencies present"
    else
        print_error "Missing required dependencies"
        return 1
    fi
}

validate_app_json() {
    print_status "Validating app.json/app.config.js..."
    
    if [ -f "app.json" ]; then
        # Validate app.json
        if node -e "JSON.parse(require('fs').readFileSync('app.json', 'utf8'))" 2>/dev/null; then
            print_success "app.json is valid JSON"
            
            # Check required fields
            if node -e "
                const config = JSON.parse(require('fs').readFileSync('app.json', 'utf8'));
                if (!config.expo) throw new Error('Missing expo configuration');
                if (!config.expo.name) throw new Error('Missing app name');
                if (!config.expo.slug) throw new Error('Missing app slug');
                console.log('Required expo configuration present');
            " 2>/dev/null; then
                print_success "Required expo configuration present"
            else
                print_error "Missing required expo configuration"
                return 1
            fi
        else
            print_error "app.json is invalid JSON"
            return 1
        fi
    else
        print_warning "app.json not found (might be using app.config.js)"
    fi
}

validate_workflow_yaml() {
    print_status "Validating GitHub Actions workflow..."
    
    if [ -f ".github/workflows/ios-enterprise.yml" ]; then
        # Check YAML syntax
        if command -v yq &> /dev/null; then
            if yq eval '.' .github/workflows/ios-enterprise.yml > /dev/null 2>&1; then
                print_success "Workflow YAML syntax is valid"
            else
                print_error "Workflow YAML syntax is invalid"
                return 1
            fi
        else
            print_warning "yq not available - skipping YAML syntax check"
        fi
        
        # Check for required secrets usage
        if grep -q "EXPO_TOKEN" .github/workflows/ios-enterprise.yml; then
            print_success "EXPO_TOKEN properly referenced in workflow"
        else
            print_error "EXPO_TOKEN not found in workflow"
            return 1
        fi
    else
        print_error "Workflow file not found: .github/workflows/ios-enterprise.yml"
        return 1
    fi
}

validate_npmrc() {
    print_status "Validating .npmrc configuration..."
    
    if [ -f ".npmrc" ]; then
        # Check .npmrc format
        if grep -q "package-manager=npm" .npmrc; then
            print_success ".npmrc correctly specifies npm as package manager"
        else
            print_warning ".npmrc exists but doesn't specify npm as package manager"
        fi
    else
        print_warning ".npmrc not found - package manager not explicitly set"
    fi
}

validate_dependencies() {
    print_status "Checking dependency consistency..."
    
    if [ -f "package-lock.json" ]; then
        print_success "package-lock.json present (npm lockfile)"
        
        if [ -f "yarn.lock" ]; then
            print_warning "Both package-lock.json and yarn.lock present - may cause conflicts"
        fi
    else
        print_error "package-lock.json not found - dependencies not locked"
        return 1
    fi
}

validate_environment() {
    print_status "Validating environment setup..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version | sed 's/v//')
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)
    
    if [ "$MAJOR_VERSION" -ge "20" ]; then
        print_success "Node.js version $NODE_VERSION (meets requirement: >=20.x)"
    else
        print_warning "Node.js version $NODE_VERSION (recommended: >=20.x for compatibility)"
    fi
}

# Run all validations
echo "Starting comprehensive build validation..."
echo

# Set error flag
VALIDATION_FAILED=false

# Run each validation
validate_environment || VALIDATION_FAILED=true
validate_package_json || VALIDATION_FAILED=true
validate_app_json || VALIDATION_FAILED=true
validate_npmrc || VALIDATION_FAILED=true
validate_dependencies || VALIDATION_FAILED=true
validate_eas_json || VALIDATION_FAILED=true
validate_workflow_yaml || VALIDATION_FAILED=true

echo
echo "=========================================="

if [ "$VALIDATION_FAILED" = true ]; then
    print_error "❌ VALIDATION FAILED - Fix issues before pushing!"
    echo
    echo "🛠️  Common fixes:"
    echo "  • Run: npm install"
    echo "  • Fix: eas.json configuration errors"
    echo "  • Check: GitHub secrets (EXPO_TOKEN)"
    echo "  • Verify: All JSON files are valid"
    exit 1
else
    print_success "🎉 ALL VALIDATIONS PASSED!"
    echo
    echo "✅ Ready to push and build successfully!"
    echo "🚀 Commit and push with confidence!"
    exit 0
fi
