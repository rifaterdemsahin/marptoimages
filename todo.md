# TODO List - Marp to Images Project

## High Priority

### Main feature
- [ ] Concert Marp to Images
- [ ] Download the images in bulk


### Error Handling & User Experience
- [x] Improve error messages shown to users
- [x] Add loading/progress indicators during conversion
- [x] Add client-side validation before upload
- [x] Display meaningful error messages for different failure types
- [x] Add conversion status feedback
- [x] Implement proper HTTP status codes for all endpoints


### Documentation
- [x] Add API documentation (endpoints, parameters, responses)
- [x] Create user guide with examples
- [x] Add developer setup instructions
- [ ] Document Marp syntax supported
- [ ] Add troubleshooting guide
- [ ] Add architecture diagram


### Avoid Features
- [x] Add file type validation (only allow .md files)
- [x] Add file size limits to prevent abuse
- [ ] Implement rate limiting on /convert endpoint
- [ ] Add CORS configuration for production
- [ ] Sanitize user input in textarea
- [ ] Add CSRF protection
- [x] Review and secure file upload handling
- [ ] Add drag-and-drop file upload support
- [ ] Add preview of Marp content before conversion
- [ ] Show thumbnail previews of generated images
- [ ] Add download individual images option (not just ZIP)
- [ ] Improve responsive design for mobile devices
- [ ] Add dark mode support
- [ ] Add conversion history in browser (localStorage)
- [ ] Add configuration file for customizable settings
- [ ] Implement proper logging system
- [x] Add health check endpoint for monitoring
- [x] Optimize temporary file cleanup strategy
- [ ] Add image quality/resolution options
- [ ] Support batch conversion (multiple files)
- [ ] Add API versioning
- [x] Create contributing guidelines
- [ ] Add ESLint configuration
- [ ] Add Prettier for code formatting
- [ ] Refactor index.js (separate routes, controllers, services)
- [x] Add JSDoc comments to functions
- [ ] Remove hardcoded values (use environment variables)
- [ ] Add proper error classes
- [ ] Implement dependency injection
- [ ] Add unit tests for backend conversion logic
- [ ] Add integration tests for file upload and conversion flow
- [ ] Add frontend tests for UI interactions
- [ ] Set up test coverage reporting
- [ ] Add CI/CD pipeline for automated testing
- [ ] Test error scenarios (invalid files, large files, corrupted uploads)
- [ ] Support additional output formats (PDF, PPTX, JPG, SVG) 
- [ ] Add custom themes support for Marp presentations 
- [ ] Add image optimization options (compression, format conversion)
- [ ] Support conversion from URL (fetch remote Marp files)
- [ ] Add user accounts and saved presentations
- [ ] Add presentation templates library
- [ ] Add collaborative editing features
- [ ] Support custom fonts upload
- [ ] Add caching for frequently converted presentations
- [ ] Implement job queue for large conversions
- [ ] Add Redis for session/cache management
- [ ] Optimize image generation process
- [ ] Add CDN for static assets
- [ ] Implement horizontal scaling strategy
- [ ] Add database for conversion history/analytics
- [ ] Add Docker support for local development
- [ ] Set up monitoring and alerting
- [ ] Add performance metrics collection
- [ ] Create backup and recovery procedures
- [ ] Add database migrations (if database is added)
- [ ] Add conversion analytics (count, success rate, avg time)
- [ ] Implement error tracking (Sentry or similar)
- [ ] Add performance monitoring
- [ ] Track popular Marp features used
- [ ] Add user feedback mechanism
- [ ] Create admin dashboard for metrics
- [ ] Review and update dependencies to latest versions
- [ ] Remove unused dependencies
- [ ] Add package-lock.json to version control
- [ ] Fix any security vulnerabilities (npm audit)
- [ ] Update Node.js version requirement
- [x] Add engine specification in package.json
- [ ] Review Vercel configuration for optimization
- [ ] Add favicon to the website
- [x] Add meta tags for SEO
- [x] Add README badges (build status, license, etc.)
- [x] Add .editorconfig file
- [ ] Add example screenshots to README
- [ ] Create CHANGELOG.md
- [x] Add license file (if not already present)
- [ ] Add sample Marp presentations to formula folder
- [ ] Support for Marp plugins
- [ ] WebSocket support for real-time conversion updates
- [ ] GraphQL API option
- [ ] Mobile app version
- [ ] Browser extension for quick conversions
- [ ] Integration with cloud storage (Google Drive, Dropbox)
- [ ] Shareable links for converted presentations
- [ ] Export to animated GIF option

### Deployment & DevOps
- [ ] Create production deployment guide
- [ ] Add environment-specific configurations
