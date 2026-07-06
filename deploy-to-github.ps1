# Git 提交脚本 - BoxifyPack 网站部署到 GitHub
# 作者：Trae AI Assistant
# 用途：将当前项目推送到 GitHub 仓库

# 设置错误处理
$ErrorActionPreference = "Stop"

# 颜色输出函数
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

# 项目路径
$projectPath = "e:\Boxlify Packaging1"

Write-Info "========================================"
Write-Info "BoxifyPack Git 部署脚本"
Write-Info "========================================"
Write-Info ""

# 步骤 1: 检查 Git 是否安装
Write-Info "步骤 1: 检查 Git 安装状态..."
try {
    $gitVersion = git --version
    Write-Success "✓ Git 已安装: $gitVersion"
} catch {
    Write-Error "✗ Git 未安装，请先安装 Git"
    Write-Info "下载地址: https://git-scm.com/downloads"
    exit 1
}

# 步骤 2: 进入项目目录
Write-Info ""
Write-Info "步骤 2: 进入项目目录..."
Set-Location $projectPath
Write-Success "✓ 当前目录: $projectPath"

# 步骤 3: 检查 Git 仓库状态
Write-Info ""
Write-Info "步骤 3: 检查 Git 仓库状态..."
if (Test-Path ".git") {
    Write-Success "✓ Git 仓库已初始化"
} else {
    Write-Info "初始化 Git 仓库..."
    git init
    Write-Success "✓ Git 仓库初始化完成"
}

# 步骤 4: 检查 Git 用户配置
Write-Info ""
Write-Info "步骤 4: 检查 Git 用户配置..."
try {
    $userName = git config user.name
    $userEmail = git config user.email
    
    if ($userName -and $userEmail) {
        Write-Success "✓ Git 用户已配置: $userName ($userEmail)"
    } else {
        Write-Warning "! Git 用户未配置，需要设置"
        Write-Info ""
        Write-Info "请输入您的 Git 用户名（用于提交记录）:"
        $inputName = Read-Host "用户名"
        
        Write-Info "请输入您的 Git 邮箱（用于提交记录）:"
        $inputEmail = Read-Host "邮箱"
        
        git config user.name $inputName
        git config user.email $inputEmail
        
        Write-Success "✓ Git 用户配置完成: $inputName ($inputEmail)"
    }
} catch {
    Write-Error "✗ Git 配置失败"
    exit 1
}

# 步骤 5: 创建 .gitignore 文件（如果不存在）
Write-Info ""
Write-Info "步骤 5: 检查 .gitignore 文件..."
$gitignorePath = "$projectPath\.gitignore"

if (-not (Test-Path $gitignorePath)) {
    Write-Info "创建 .gitignore 文件..."
    
    $gitignoreContent = @"
# Windows 系统文件
Thumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk

# 编辑器和 IDE 文件
.vscode/
.idea/
*.swp
*.swo
*~

# 临时文件
*.tmp
*.temp
*.bak
*.log

# Node.js（如果使用）
node_modules/
npm-debug.log
yarn-error.log

# macOS 系统文件
.DS_Store
.AppleDouble
.LSOverride

# 备注和文档（可选）
# README.md
# NOTES.md

# 测试文件（可选）
# test/
# tests/
"@
    
    Set-Content -Path $gitignorePath -Value $gitignoreContent -Encoding UTF8
    Write-Success "✓ .gitignore 文件已创建"
} else {
    Write-Success "✓ .gitignore 文件已存在"
}

# 步骤 6: 添加所有文件到 Git
Write-Info ""
Write-Info "步骤 6: 添加文件到 Git..."
Write-Info "正在扫描项目文件..."

try {
    git add .
    Write-Success "✓ 文件已添加到 Git 暂存区"
    
    # 显示即将提交的文件统计
    $statusOutput = git status --short
    $fileCount = ($statusOutput | Measure-Object).Count
    Write-Info "共 $fileCount 个文件/文件夹将被提交"
} catch {
    Write-Error "✗ 文件添加失败: $_"
    exit 1
}

# 步骤 7: 创建提交
Write-Info ""
Write-Info "步骤 7: 创建 Git 提交..."
$commitMessage = "Initial commit: BoxifyPack website - Premium packaging solutions"

try {
    git commit -m $commitMessage
    Write-Success "✓ 提交已创建: $commitMessage"
} catch {
    Write-Warning "! 提交可能失败或已存在"
    Write-Info "错误信息: $_"
}

# 步骤 8: 配置 GitHub 远程仓库
Write-Info ""
Write-Info "步骤 8: 配置 GitHub 远程仓库..."
Write-Info ""
Write-Info "请输入您的 GitHub 仓库 URL（格式示例）:"
Write-Info "  HTTPS: https://github.com/YOUR_USERNAME/boxlifypack.com.git"
Write-Info "  SSH:   git@github.com:YOUR_USERNAME/boxlifypack.com.git"
Write-Info ""
$repoUrl = Read-Host "GitHub 仓库 URL"

if (-not $repoUrl) {
    Write-Error "✗ 仓库 URL 未提供，无法继续"
    exit 1
}

try {
    # 检查是否已存在远程仓库
    $existingRemote = git remote get-url origin
    
    if ($existingRemote) {
        Write-Info "远程仓库已存在: $existingRemote"
        Write-Info "是否要更新远程仓库 URL？(y/n)"
        $updateRemote = Read-Host "选择"
        
        if ($updateRemote -eq "y") {
            git remote set-url origin $repoUrl
            Write-Success "✓ 远程仓库 URL 已更新: $repoUrl"
        } else {
            Write-Info "保持现有远程仓库: $existingRemote"
        }
    } else {
        git remote add origin $repoUrl
        Write-Success "✓ 远程仓库已添加: $repoUrl"
    }
} catch {
    Write-Error "✗ 远程仓库配置失败: $_"
    exit 1
}

# 步骤 9: 推送到 GitHub
Write-Info ""
Write-Info "步骤 9: 推送到 GitHub..."
Write-Info "正在推送到远程仓库..."

try {
    # 设置默认分支为 main
    git branch -M main
    
    # 推送到 GitHub
    git push -u origin main --force
    
    Write-Success "✓ 文件已成功推送到 GitHub!"
    Write-Success "✓ 分支: main"
    Write-Success "✓ 仓库: $repoUrl"
} catch {
    Write-Warning "! 推送可能遇到问题"
    Write-Info "错误信息: $_"
    Write-Info ""
    Write-Info "可能的原因:"
    Write-Info "  1. GitHub 仓库尚未创建"
    Write-Info "  2. 需要 GitHub 认证（用户名/密码或 SSH key）"
    Write-Info "  3. 网络连接问题"
    Write-Info ""
    Write-Info "解决方案:"
    Write-Info "  - 确认 GitHub 仓库已创建: https://github.com/new"
    Write-Info "  - 配置 GitHub 认证:"
    Write-Info "    HTTPS: git config credential.helper store"
    Write-Info "    SSH:   配置 SSH key 到 GitHub"
    
    exit 1
}

# 步骤 10: 创建 CNAME 文件（用于自定义域名）
Write-Info ""
Write-Info "步骤 10: 创建 CNAME 文件..."
$cnamePath = "$projectPath\CNAME"

if (-not (Test-Path $cnamePath)) {
    Set-Content -Path $cnamePath -Value "boxlifypack.com" -Encoding UTF8
    Write-Success "✓ CNAME 文件已创建: boxlifypack.com"
    
    # 提交 CNAME 文件
    git add CNAME
    git commit -m "Add custom domain: boxlifypack.com"
    git push origin main
    
    Write-Success "✓ CNAME 文件已推送到 GitHub"
} else {
    Write-Success "✓ CNAME 文件已存在"
}

# 完成
Write-Info ""
Write-Success "========================================"
Write-Success "✓ Git 部署完成！"
Write-Success "========================================"
Write-Info ""
Write-Info "下一步操作:"
Write-Info "1. 访问 GitHub 仓库: $repoUrl"
Write-Info "2. 启用 GitHub Pages:"
Write-Info "   Settings → Pages → Source: main → Save"
Write-Info "3. 配置域名 DNS:"
Write-Info "   添加 4 个 A 记录指向 GitHub Pages IP"
Write-Info "4. 等待 DNS 解析和 SSL 配置（几分钟到几小时）"
Write-Info "5. 访问您的网站: https://boxlifypack.com"
Write-Info ""
Write-Info "GitHub Pages IP 地址:"
Write-Info "  185.199.108.153"
Write-Info "  185.199.109.153"
Write-Info "  185.199.110.153"
Write-Info "  185.199.111.153"
Write-Info ""
Write-Success "✓ 脚本执行完成，祝您部署顺利！"

# 等待用户确认
Write-Info ""
Read-Host "按 Enter 键退出"