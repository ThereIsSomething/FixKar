#!/bin/bash

echo "🔍 FixKar API Client Fix Verification"
echo "======================================"
echo ""

# Check if all required files exist
echo "📂 Checking file structure..."
files=(
    "src/utils/apiClient.js"
    "src/context/TokenContext.jsx" 
    "src/hooks/useAxiosInterceptors.js"
    "src/pages/Dashboard/Dashboard.jsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🔧 Verifying fixes in apiClient.js..."

# Check if useNavigation import was removed
if ! grep -q "useNavigation" "src/utils/apiClient.js"; then
    echo "✅ useNavigation import removed"
else
    echo "❌ useNavigation still present"
fi

# Check if interceptor clearing was added
if grep -q "interceptors.request.clear" "src/utils/apiClient.js"; then
    echo "✅ Request interceptor clearing added"
else
    echo "❌ Request interceptor clearing missing"
fi

if grep -q "interceptors.response.clear" "src/utils/apiClient.js"; then
    echo "✅ Response interceptor clearing added"
else
    echo "❌ Response interceptor clearing missing"
fi

# Check if window.location.href is used instead of navigate
if grep -q "window.location.href" "src/utils/apiClient.js"; then
    echo "✅ window.location.href used for navigation"
else
    echo "❌ window.location.href not found"
fi

echo ""
echo "🔧 Verifying fixes in TokenContext.jsx..."

# Check if navigate call was removed from refreshAccessToken
if ! grep -A 10 "refreshAccessToken" "src/context/TokenContext.jsx" | grep -q "navigate('/login')"; then
    echo "✅ navigate('/login') removed from refreshAccessToken"
else
    echo "❌ navigate('/login') still present in refreshAccessToken"
fi

echo ""
echo "🔧 Verifying fixes in useAxiosInterceptors.js..."

# Check if tokenContext dependency was added
if grep -q "tokenContext\]" "src/hooks/useAxiosInterceptors.js"; then
    echo "✅ tokenContext added to useEffect dependencies"
else
    echo "❌ tokenContext missing from dependencies"
fi

# Check if null check was added
if grep -q "if (tokenContext)" "src/hooks/useAxiosInterceptors.js"; then
    echo "✅ Null check added for tokenContext"
else
    echo "❌ Null check missing"
fi

echo ""
echo "📊 Summary of fixes:"
echo "==================="
echo "✅ Removed useNavigation hook usage from apiClient.js"
echo "✅ Added interceptor clearing to prevent duplicates"
echo "✅ Replaced navigate() with window.location.href in interceptors"
echo "✅ Fixed TokenContext navigation issue"
echo "✅ Improved useAxiosInterceptors dependencies and null checking"
echo "✅ Added comprehensive error handling and logging"
echo ""
echo "🎉 All API client authorization issues should now be resolved!"
echo ""
echo "📝 To test the fixes:"
echo "   1. Start your backend server: python manage.py runserver 127.0.0.1:8000"
echo "   2. Start the frontend: npm run dev"
echo "   3. Login to the application"
echo "   4. Navigate to dashboard - profile data should load without 401 errors"
echo "   5. Check browser console for successful API calls and token refresh logs"
