# Contributing to LaunchRush

## Code of Conduct

This project adheres to honest, transparent development practices focused on user safety and security.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make changes
5. Commit: `git commit -am 'Add my feature'`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev

# Run tests
npm run test

# Format code
npm run format

# Type check
npm run type-check
```

## Coding Standards

### TypeScript
- Use strict mode
- No `any` types without justification
- Export interfaces for component props

### React Components
- Use functional components
- Use hooks for state
- Memoize expensive computations
- Use `React.FC` type annotation

### Naming Conventions
- Components: PascalCase (e.g., `TokenCard`)
- Functions: camelCase (e.g., `formatAddress`)
- Constants: UPPER_CASE (e.g., `MAX_SUPPLY`)
- Files: Match export name or use index.ts

### Code Organization
```
component.tsx
- Imports
- Types/Interfaces
- Component Definition
- Hooks
- Event Handlers
- Render Logic
- Export
```

## Commit Messages

Follow conventional commits:

```
feat: Add token search functionality
fix: Resolve wallet connection timeout
docs: Update API documentation
style: Format code with Prettier
refactor: Improve error handling
test: Add unit tests for TokenCard
chore: Update dependencies
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass: `npm run test`
4. Run type check: `npm run type-check`
5. Format code: `npm run format`
6. Update CHANGELOG.md
7. Request review from maintainers

## Testing

### Unit Tests
```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure
```typescript
import { render, screen } from '@testing-library/react';
import { TokenCard } from '@/components/Discovery/TokenCard';

describe('TokenCard', () => {
  it('renders token information', () => {
    const mockToken = { /* ... */ };
    render(<TokenCard token={mockToken} />);
    expect(screen.getByText(mockToken.name)).toBeInTheDocument();
  });
});
```

## Security Considerations

### Before Contributing
- Never commit private keys or API keys
- Don't store sensitive data in frontend code
- Validate all user inputs
- Sanitize blockchain addresses

### Security Review Checklist
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Error messages don't leak information
- [ ] Proper CORS handling
- [ ] Rate limiting implemented
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection in place

## Adding New Chains

1. Create blockchain adapter:
   ```typescript
   // src/lib/blockchain/[chainname].ts
   export class [Chain]Blockchain {
     async createToken(config, onStatusChange, signTransaction) { }
     async getTokenInfo(tokenAddress) { }
   }
   ```

2. Update chain config:
   ```typescript
   // src/lib/config/chains.ts
   [chainname]: {
     id: 'chainname',
     name: 'Chain Name',
     // ...
   }
   ```

3. Update wallet adapters
4. Add chain-specific tests
5. Document in SETUP.md

## Adding Features

### New Component
1. Create folder: `src/components/Feature/`
2. Create component file
3. Export from index
4. Add to appropriate page
5. Write tests
6. Document usage

### New API Endpoint
1. Create file: `src/pages/api/[route].ts`
2. Implement handler
3. Add error handling
4. Document in API_GUIDE.md
5. Add tests
6. Update API client if needed

### New Page
1. Create file: `src/pages/[name].tsx`
2. Add navigation links
3. Style with Tailwind
4. Mobile optimize
5. Add meta tags
6. Test on mobile

## Documentation

### Code Comments
- Explain "why", not "what"
- Use JSDoc for functions
- Document complex logic

### README
- Keep main README concise
- Link to detailed docs
- Add badges for status

### Docs Folder
- SETUP.md: Installation & configuration
- DEPLOYMENT.md: Deployment instructions
- ARCHITECTURE.md: System design
- API_GUIDE.md: API documentation

## Reporting Issues

### Bug Report
- Describe the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details

### Feature Request
- Clear description of need
- Use cases/examples
- Proposed implementation
- Design mockups if applicable

## Performance

### Best Practices
- Minimize bundle size
- Lazy load components
- Optimize images
- Cache API responses
- Avoid unnecessary re-renders
- Use React.memo for expensive components

### Performance Targets
- Page load: < 3s on 3G
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 4s
- Cumulative Layout Shift: < 0.1

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.0.0`
4. Push: `git push origin v1.0.0`
5. Create GitHub release
6. Deploy to production

## Questions?

- Check docs in `/docs`
- Search existing issues
- Open a discussion
- Ask in community channels

## Thank You!

Contributions are the heart of LaunchRush. Thank you for helping make it better! 🚀
