# Marp to Images - Architecture

**Version:** 1.0.3  
**Last Updated:** January 8, 2025

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        GHPages[GitHub Pages]
    end
    
    subgraph "CDN & Static Assets"
        Bootstrap[Bootstrap CSS/JS]
        StaticFiles[Static Files: CSS, JS, HTML]
    end
    
    subgraph "Vercel Serverless Platform"
        subgraph "Express.js Application"
            Routes[Route Handlers]
            Middleware[Middleware Layer]
            HealthCheck[Health Check Endpoint]
        end
        
        subgraph "File Processing"
            Multer[Multer File Upload]
            TmpStorage[/tmp Storage]
            MarpCLI[Marp CLI Converter]
            Archiver[ZIP Archiver]
        end
    end
    
    Browser -->|HTTPS Request| Routes
    GHPages -->|Redirect| Browser
    Browser -->|Load Assets| StaticFiles
    Browser -->|Load Styles| Bootstrap
    
    Routes -->|POST /convert| Middleware
    Routes -->|GET /health| HealthCheck
    Routes -->|GET /| StaticFiles
    
    Middleware -->|Validate| Multer
    Multer -->|Save| TmpStorage
    TmpStorage -->|Read| MarpCLI
    MarpCLI -->|Generate PNG| TmpStorage
    TmpStorage -->|Package| Archiver
    Archiver -->|Download| Browser
    
    style Browser fill:#4CAF50
    style Routes fill:#2196F3
    style MarpCLI fill:#FF9800
    style TmpStorage fill:#9C27B0
```

---

## 📊 Request Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Vercel
    participant Express
    participant Multer
    participant FileSystem
    participant MarpCLI
    participant Archiver
    
    User->>Browser: Visit homepage
    Browser->>Vercel: GET /
    Vercel->>Express: Route request
    Express-->>Browser: Return index.html
    Browser-->>User: Display UI
    
    User->>Browser: Paste Marp content & click Convert
    Browser->>Vercel: POST /convert (FormData)
    Vercel->>Express: Route request
    Express->>Multer: Process upload
    Multer->>FileSystem: Save to /tmp/uploads/
    FileSystem-->>Multer: File path
    
    Multer->>MarpCLI: Convert markdown
    MarpCLI->>FileSystem: Save PNGs to /tmp/output/
    FileSystem-->>MarpCLI: Files created
    
    MarpCLI->>Archiver: Create ZIP
    Archiver->>FileSystem: Read PNGs
    FileSystem-->>Archiver: PNG data
    Archiver->>FileSystem: Write ZIP to /tmp/output/
    FileSystem-->>Archiver: ZIP created
    
    Archiver-->>Express: ZIP path
    Express-->>Browser: Download ZIP
    Browser-->>User: Save file
    
    Express->>FileSystem: Cleanup temp files
```

---

## 🏛️ Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        HTML[index.html]
        CSS[style.css]
        JS[script.js]
    end
    
    subgraph "Backend Components"
        Server[Express Server]
        Router[Route Handlers]
        Upload[File Upload Logic]
        Converter[Marp Converter]
        Zipper[ZIP Creator]
        Cleanup[Cleanup Service]
    end
    
    subgraph "External Dependencies"
        ExpressNPM[express@5.1.0]
        MarpNPM[@marp-team/marp-cli@4.2.3]
        MulterNPM[multer@2.0.2]
        ArchiverNPM[archiver@7.0.1]
    end
    
    HTML --> JS
    JS --> Server
    Server --> Router
    Router --> Upload
    Router --> Converter
    Router --> Zipper
    Zipper --> Cleanup
    
    Server -.uses.-> ExpressNPM
    Upload -.uses.-> MulterNPM
    Converter -.uses.-> MarpNPM
    Zipper -.uses.-> ArchiverNPM
```

---

## 🌐 Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DevLocal[Local Development<br/>localhost:3000]
        DevGit[Git Repository<br/>GitHub]
    end
    
    subgraph "CI/CD"
        GitPush[git push]
        VercelDeploy[Vercel Auto-Deploy]
        BuildProcess[Build & Deploy Process]
    end
    
    subgraph "Production"
        VercelEdge[Vercel Edge Network]
        ServerlessFunc[Serverless Functions]
        CDN[Static File CDN]
    end
    
    subgraph "Monitoring"
        VercelLogs[Deployment Logs]
        HealthAPI[Health Endpoint]
        DebugConsole[Debug Console]
    end
    
    DevLocal -->|Commit| DevGit
    DevGit -->|Webhook| GitPush
    GitPush --> VercelDeploy
    VercelDeploy --> BuildProcess
    BuildProcess --> ServerlessFunc
    BuildProcess --> CDN
    
    ServerlessFunc --> VercelEdge
    CDN --> VercelEdge
    
    VercelEdge -.logs.-> VercelLogs
    ServerlessFunc -.monitors.-> HealthAPI
    VercelEdge -.debug.-> DebugConsole
    
    style DevLocal fill:#4CAF50
    style VercelEdge fill:#2196F3
    style ServerlessFunc fill:#FF9800
```

---

## 📁 File Structure

```mermaid
graph TB
    Root[marptoimages/]
    
    Root --> GH[.github/workflows/]
    Root --> Sem[Semblance/]
    Root --> Marp[marp-to-images/]
    Root --> Files[Root Files]
    
    GH --> StaticYML[static.yml]
    
    Sem --> Guides[Documentation Files]
    Guides --> Trouble[TROUBLESHOOTING.md]
    Guides --> URLGuide[URL_DIFFERENCE_GUIDE.md]
    Guides --> GitGuide[GIT_WORKFLOW_GUIDE.md]
    
    Marp --> Public[public/]
    Marp --> Formula[formula/]
    Marp --> Backend[Backend Files]
    
    Public --> IndexHTML[index.html]
    Public --> ScriptJS[script.js]
    Public --> StyleCSS[style.css]
    Public --> SampleMD[sample_marp.md]
    
    Backend --> IndexJS[index.js]
    Backend --> PackageJSON[package.json]
    Backend --> VercelJSON[vercel.json]
    
    Files --> README[README.md]
    Files --> RootIndex[index.html]
    Files --> RootVercel[vercel.json]
    Files --> License[LICENSE]
    
    style Root fill:#2196F3
    style Marp fill:#4CAF50
    style Public fill:#FF9800
```

---

## 🔄 Data Flow

```mermaid
flowchart TD
    Start([User Opens App]) --> Load[Load Homepage]
    Load --> Input[Paste/Load Marp Content]
    Input --> Validate{Valid Content?}
    
    Validate -->|No| Error[Show Error Message]
    Error --> Input
    
    Validate -->|Yes| Upload[Create FormData & Upload]
    Upload --> Server[POST /convert]
    
    Server --> SaveFile[Save to /tmp/uploads/]
    SaveFile --> Convert[Run Marp CLI]
    Convert --> CheckFiles{Files Generated?}
    
    CheckFiles -->|No| ConvertError[Return 422 Error]
    ConvertError --> Cleanup1[Cleanup Files]
    Cleanup1 --> ShowError[Display Error]
    ShowError --> End([End])
    
    CheckFiles -->|Yes| Rename[Rename to .png]
    Rename --> CreateZIP[Create ZIP Archive]
    CreateZIP --> Download[Send ZIP to Browser]
    Download --> Cleanup2[Cleanup Temp Files]
    Cleanup2 --> Success[Show Success Message]
    Success --> End
    
    style Start fill:#4CAF50
    style Success fill:#4CAF50
    style Error fill:#f44336
    style ConvertError fill:#f44336
```

---

## 🛡️ Security Architecture

```mermaid
graph TB
    subgraph "Input Validation"
        FileType[File Type Check<br/>.md, .markdown]
        FileSize[Size Limit Check<br/>5MB max]
        MimeType[MIME Type Validation]
    end
    
    subgraph "Processing Security"
        Isolation[Serverless Isolation]
        TmpOnly[/tmp Only Access]
        AutoCleanup[Auto Cleanup]
    end
    
    subgraph "Output Security"
        NoExec[No Code Execution]
        SafeDownload[Safe Download Headers]
        HTTPS[HTTPS Only]
    end
    
    Request[User Request] --> FileType
    FileType --> FileSize
    FileSize --> MimeType
    
    MimeType --> Isolation
    Isolation --> TmpOnly
    TmpOnly --> AutoCleanup
    
    AutoCleanup --> NoExec
    NoExec --> SafeDownload
    SafeDownload --> HTTPS
    HTTPS --> Response[Secure Response]
    
    style FileType fill:#FF5722
    style Isolation fill:#FF5722
    style HTTPS fill:#FF5722
```

---

## ⚡ Performance Architecture

```mermaid
graph LR
    subgraph "Frontend Optimization"
        CDN[Bootstrap CDN]
        Cache[No-Cache Headers]
        Minify[Minified Assets]
    end
    
    subgraph "Backend Optimization"
        Serverless[Serverless Scaling]
        Concurrent[Concurrent Processing]
        Compression[ZIP Compression Level 9]
    end
    
    subgraph "Network Optimization"
        EdgeNetwork[Vercel Edge Network]
        GZIP[GZIP Compression]
        HTTP2[HTTP/2 Protocol]
    end
    
    Client[Client Request] --> CDN
    CDN --> Cache
    Cache --> EdgeNetwork
    
    EdgeNetwork --> Serverless
    Serverless --> Concurrent
    Concurrent --> Compression
    
    EdgeNetwork --> GZIP
    GZIP --> HTTP2
    HTTP2 --> FastResponse[Fast Response]
    
    style EdgeNetwork fill:#2196F3
    style Serverless fill:#4CAF50
    style FastResponse fill:#4CAF50
```

---

## 🔧 Technology Stack

```mermaid
mindmap
  root((Marp to Images))
    Frontend
      HTML5
      CSS3
      JavaScript ES6+
      Bootstrap 5.3.0
    Backend
      Node.js 18+
      Express.js 5.1.0
      Marp CLI 4.2.3
    Storage
      Multer 2.0.2
      Archiver 7.0.1
      /tmp filesystem
    Deployment
      Vercel Serverless
      GitHub Actions
      GitHub Pages
    Development
      Git
      npm
      VSCode
      EditorConfig
```

---

## 📈 Scalability Architecture

```mermaid
graph TB
    subgraph "Auto-Scaling"
        Request[Incoming Request]
        Router[Vercel Router]
        Scale{Load Level?}
    end
    
    subgraph "Serverless Instances"
        Func1[Function Instance 1]
        Func2[Function Instance 2]
        Func3[Function Instance 3]
        FuncN[Function Instance N...]
    end
    
    subgraph "Resource Management"
        CPU[CPU: 1 vCPU]
        Memory[Memory: 1024 MB]
        Timeout[Timeout: 30s]
        TmpSpace[/tmp: 512 MB]
    end
    
    Request --> Router
    Router --> Scale
    
    Scale -->|Low| Func1
    Scale -->|Medium| Func2
    Scale -->|High| Func3
    Scale -->|Very High| FuncN
    
    Func1 -.uses.-> CPU
    Func1 -.uses.-> Memory
    Func1 -.uses.-> Timeout
    Func1 -.uses.-> TmpSpace
    
    style Scale fill:#FF9800
    style FuncN fill:#4CAF50
```

---

## 🔍 Monitoring & Debugging

```mermaid
graph TB
    subgraph "Built-in Monitoring"
        Health[Health Check<br/>/health endpoint]
        DebugPanel[Debug Console<br/>Frontend UI]
        ServerLogs[Server Console Logs]
    end
    
    subgraph "Vercel Dashboard"
        Deployments[Deployment History]
        Logs[Real-time Logs]
        Analytics[Usage Analytics]
        Errors[Error Tracking]
    end
    
    subgraph "GitHub Integration"
        Actions[GitHub Actions]
        Issues[Issue Tracker]
        Commits[Commit History]
    end
    
    App[Application] --> Health
    App --> DebugPanel
    App --> ServerLogs
    
    Health -.reports to.-> Logs
    DebugPanel -.shows.-> Errors
    ServerLogs -.feeds.-> Logs
    
    Deployments --> Actions
    Errors --> Issues
    Logs --> Commits
    
    style Health fill:#4CAF50
    style Errors fill:#f44336
    style Logs fill:#2196F3
```

---

## 📚 API Architecture

```mermaid
graph LR
    subgraph "Public Endpoints"
        Root[GET /<br/>Homepage]
        Health[GET /health<br/>Status Check]
        Convert[POST /convert<br/>File Conversion]
        Static[GET /static/*<br/>Assets]
    end
    
    subgraph "Request Processing"
        Validation[Input Validation]
        Processing[File Processing]
        Response[Response Generation]
    end
    
    subgraph "Response Types"
        HTML[HTML Pages]
        JSON[JSON Data]
        Binary[Binary ZIP]
        Error[Error Messages]
    end
    
    Root --> HTML
    Health --> JSON
    Static --> HTML
    
    Convert --> Validation
    Validation --> Processing
    Processing --> Binary
    Processing --> Error
    
    style Convert fill:#FF9800
    style Binary fill:#4CAF50
    style Error fill:#f44336
```

---

## Summary

This architecture document provides a comprehensive visual overview of the Marp to Images application, including:

- **System Architecture**: Overall structure and component relationships
- **Request Flow**: Step-by-step process from user interaction to response
- **Component Architecture**: Frontend, backend, and dependency relationships
- **Deployment Architecture**: Development to production pipeline
- **File Structure**: Organization of project files and directories
- **Data Flow**: User journey from input to output
- **Security Architecture**: Validation and protection mechanisms
- **Performance Architecture**: Optimization strategies
- **Technology Stack**: Complete technology overview
- **Scalability Architecture**: Auto-scaling and resource management
- **Monitoring & Debugging**: Observability and troubleshooting
- **API Architecture**: Endpoint structure and processing

All diagrams are in Mermaid format and can be rendered in GitHub, documentation sites, or any Mermaid-compatible viewer.
