import {
  Book,
  Box,
  Check,
  ChevronRight,
  Code,
  Copy,
  FileCode,
  Globe,
  Package,
  Puzzle,
  Terminal,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Code block component with copy functionality
const CodeBlock = ({
  code,
  language,
  title,
  isMobile,
}: {
  code: string;
  language: string;
  title?: string;
  isMobile?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div
        className={cn(
          'absolute z-10 transition-opacity',
          isMobile ? 'right-1 top-1 opacity-100' : 'right-2 top-2 opacity-0 group-hover:opacity-100'
        )}
      >
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className={cn(
            'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300',
            isMobile ? 'h-7 px-1.5 text-xs' : 'h-8 px-2 text-xs'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              {!isMobile && 'Copied'}
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              {!isMobile && 'Copy'}
            </>
          )}
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <div
          className={cn(
            'flex items-center justify-between bg-zinc-900 text-xs text-zinc-400',
            isMobile ? 'px-3 py-1.5' : 'px-4 py-2'
          )}
        >
          <span className="font-mono truncate">{title || language}</span>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: isMobile ? '0.75rem' : '1rem',
            background: '#1e1e1e',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            lineHeight: '1.5',
            overflowX: 'auto',
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// Navigation item component
const NavItem = ({
  href,
  title,
  active,
  onClick,
}: {
  href: string;
  title: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={cn(
      'block px-3 py-2 text-sm rounded-md transition-all duration-200',
      active
        ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary ml-[-2px]'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    )}
  >
    {title}
  </a>
);

export const Documentation = ({ isMobile }: { isMobile?: boolean }) => {
  const [activeSection, setActiveSection] = useState('introduction');

  // Debug log
  console.log('Documentation component - isMobile:', isMobile);

  const navigation = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'quick-start', title: 'Quick Start' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'tab-transport', title: 'Tab Transport' },
    { id: 'extension-transport', title: 'Extension Transport' },
    { id: 'react-hooks', title: 'React Hooks' },
    { id: 'examples', title: 'Examples' },
    { id: 'api-reference', title: 'API Reference' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track active section based on scroll position using Intersection Observer
  React.useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navigation.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={cn('min-h-screen', isMobile ? 'relative' : 'flex relative')}>
      {/* Sidebar Navigation - Hidden on mobile */}
      {!isMobile && (
        <aside className="w-64 border-r bg-muted/30 p-6 sticky top-0 h-screen overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Documentation
            </h2>
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.id}
                  href={`#${item.id}`}
                  title={item.title}
                  active={activeSection === item.id}
                  onClick={() => scrollToSection(item.id)}
                />
              ))}
            </nav>
          </div>

          <div className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-semibold mb-3">Resources</h3>
            <div className="space-y-2">
              <a
                href="https://github.com/MiguelsPizza/WebMCP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Code className="h-4 w-4" />
                GitHub Repository
              </a>
              <a
                href="https://npmjs.com/package/@mcp-b/transports"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Package className="h-4 w-4" />
                NPM Package
              </a>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex items-center gap-2 shrink-0 mr-2">
                <Book className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Docs:</span>
              </div>
              <nav className="flex gap-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn('flex-1 mx-auto', isMobile ? 'px-4 py-8' : 'max-w-4xl px-8 py-12')}>
        {/* Header */}
        <header className="mb-12">
          <div className={cn('mb-4', isMobile ? '' : 'flex items-center gap-3')}>
            <div
              className={cn('bg-primary/10 rounded-lg', isMobile ? 'p-2 inline-block mb-3' : 'p-3')}
            >
              <Globe className={cn('text-primary', isMobile ? 'h-6 w-6' : 'h-8 w-8')} />
            </div>
            <div>
              <h1 className={cn('font-bold', isMobile ? 'text-2xl' : 'text-4xl')}>
                MCP-B Documentation
              </h1>
              <p className={cn('text-muted-foreground mt-1', isMobile ? 'text-base' : 'text-xl')}>
                Browser-based Model Context Protocol
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="secondary">v1.0.0</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">React</Badge>
          </div>
        </header>

        {/* Introduction Section */}
        <section id="introduction" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Introduction</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What is MCP-B?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                MCP-B brings the power of the Model Context Protocol (MCP) to the browser, enabling
                AI agents to interact with web applications using existing authentication and
                structured data access instead of screen scraping.
              </p>
              <div
                className={cn(
                  'gap-4 mt-6',
                  isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2'
                )}
              >
                <div className="flex gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Use Existing Auth</h4>
                    <p className="text-sm text-muted-foreground">
                      Leverage browser cookies, sessions, and OAuth
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Puzzle className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Structured Access</h4>
                    <p className="text-sm text-muted-foreground">
                      MCP tools instead of HTML parsing
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Globe className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Cross-Domain Workflows</h4>
                    <p className="text-sm text-muted-foreground">
                      Orchestrate across multiple web apps
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Box className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Browser Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Operates within existing permissions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">The Problem</h3>
            <p className="text-muted-foreground mb-4">
              Most white-collar work happens in the browser, yet MCP's solution has been to bypass
              browsers entirely and connect directly to APIs. This creates two major issues:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span>
                  <strong>Authentication complexity</strong> - MCP is essentially reinventing auth
                  systems that browsers have already solved
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span>
                  <strong>Poor agent experience</strong> - Browser automation tools force LLMs to
                  parse visual content and irrelevant HTML
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Quick Start Section */}
        <section id="quick-start" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Quick Start</h2>

          <Tabs defaultValue="web" className="mb-8 w-full">
            <TabsList className={cn('grid w-full grid-cols-2', isMobile && 'h-auto p-1')}>
              <TabsTrigger value="web">Web Developers</TabsTrigger>
              <TabsTrigger value="extension">Extension Users</TabsTrigger>
            </TabsList>

            <TabsContent value="web" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Install the package</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language="bash"
                    code="npm install @mcp-b/transports @modelcontextprotocol/sdk"
                    isMobile={isMobile}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Create an MCP server in your web app</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language="typescript"
                    title="app.ts"
                    isMobile={isMobile}
                    code={`import { TabServerTransport } from '@mcp-b/transports';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';

// Create your MCP server
const server = new McpServer({
  name: 'MyWebApp',
  version: '1.0.0',
});

// Expose your app's functionality as tools
server.tool(
  'createItem',
  { name: z.string(), description: z.string() },
  async ({ name, description }) => {
    const item = await api.createItem({ name, description });
    return {
      content: [{
        type: 'text',
        text: \`Created item: \${item.id}\`
      }]
    };
  }
);

// Connect to make it discoverable
const transport = new TabServerTransport({
  allowedOrigins: ['*'] // Configure based on your security needs
});
await server.connect(transport);`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. That's it!</CardTitle>
                  <CardDescription>
                    Your web app now exposes MCP tools that AI agents can use
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="extension" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Clone and build</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language="bash"
                    isMobile={isMobile}
                    code={`git clone https://github.com/MiguelsPizza/WebMCP.git
cd MCP-B
pnpm install
pnpm build`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Load the extension</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm">
                    <li className={isMobile ? 'flex flex-col gap-1' : ''}>
                      <span>1. Open Chrome and navigate to</span>
                      <code className="px-1 py-0.5 bg-muted rounded">chrome://extensions</code>
                    </li>
                    <li>2. Enable "Developer mode"</li>
                    <li>3. Click "Load unpacked"</li>
                    <li className={isMobile ? 'flex flex-col gap-1' : ''}>
                      <span>4. Select the</span>
                      <code className="px-1 py-0.5 bg-muted rounded">extension/dist</code>
                      <span>folder</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Visit MCP-B enabled sites</CardTitle>
                  <CardDescription>
                    The extension will automatically detect and connect to MCP servers on any page
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Architecture</h2>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className={cn('mb-8', isMobile ? 'overflow-x-auto' : 'text-center')}>
                  <pre className={cn('text-left', isMobile ? 'text-xs' : 'inline-block text-sm')}>
                    {`┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Page      │     │ Content Script  │     │   Extension     │
│                 │     │                 │     │                 │
│ MCP Server      │<--->│     Relay      │<--->│  MCP Client    │
│ (Tab Transport) │     │                 │     │  + LLM Chat    │
└─────────────────┘     └─────────────────┘     └─────────────────┘`}
                  </pre>
                </div>

                <div className="grid gap-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Web Page</h4>
                      <p className="text-sm text-muted-foreground">
                        Runs an MCP server using TabServerTransport with secure message passing
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Content Script</h4>
                      <p className="text-sm text-muted-foreground">
                        Injected by the extension to relay messages between the page and background
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Extension</h4>
                      <p className="text-sm text-muted-foreground">
                        Contains the MCP client and AI chat interface, connects via
                        ExtensionClientTransport
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <p className="text-muted-foreground">
              MCP-B introduces two new transport layers that enable MCP communication in browser
              environments:
            </p>
          </div>
        </section>

        {/* Tab Transport Section */}
        <section id="tab-transport" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Tab Transport</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                In-Page Communication
              </CardTitle>
              <CardDescription>
                Use when your MCP server and client are running in the same browser tab
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The Tab Transport uses window.postMessage for secure communication with origin
                validation. This is perfect for single-page applications that want to expose
                functionality to AI agents.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Server Setup</h3>
              <CodeBlock
                language="typescript"
                title="server.ts"
                isMobile={isMobile}
                code={`import { TabServerTransport } from '@mcp-b/transports';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';

// 1. Create an MCP server
const server = new McpServer({
  name: 'WebAppServer',
  version: '1.0.0',
});

// 2. Add tools
server.tool(
  'add',
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }],
  })
);

// 3. Connect to transport with CORS configuration
const transport = new TabServerTransport({
  allowedOrigins: ['*'] // Configure based on your security needs
});
await server.connect(transport);

console.log('MCP Tab Server is running.');`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Client Setup</h3>
              <CodeBlock
                language="typescript"
                title="client.ts"
                isMobile={isMobile}
                code={`import { TabClientTransport } from '@mcp-b/transports';
import { Client } from '@modelcontextprotocol/sdk/client';

// 1. Create transport with target origin
const transport = new TabClientTransport({
  targetOrigin: window.location.origin
});

// 2. Create client
const client = new Client({
  name: 'WebAppClient',
  version: '1.0.0',
});

// 3. Connect and use
await client.connect(transport);
const result = await client.callTool({
  name: 'add',
  arguments: { a: 5, b: 10 },
});

console.log('Result:', result.content[0].text); // "15"`}
              />
            </div>
          </div>
        </section>

        {/* Extension Transport Section */}
        <section id="extension-transport" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Extension Transport</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5" />
                Cross-Context Communication
              </CardTitle>
              <CardDescription>
                Allows browser extensions to communicate with MCP servers running in web pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The Extension Transport enables communication across browser contexts through a
                relay system: Extension UI ↔ Background Script ↔ Content Script ↔ Page Script
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Background Script</h3>
              <CodeBlock
                language="typescript"
                title="background.ts"
                isMobile={isMobile}
                code={`import { ExtensionServerTransport } from '@mcp-b/transports';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Set up the extension hub
class McpHub {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'Extension-Hub',
      version: '1.0.0'
    });

    this.setupConnections();
  }

  private setupConnections() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name === 'mcp') {
        const transport = new ExtensionServerTransport(port);
        this.server.connect(transport);
      }
    });
  }
}`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Content Script</h3>
              <CodeBlock
                language="typescript"
                title="contentScript.ts"
                isMobile={isMobile}
                code={`import { TabClientTransport } from '@mcp-b/transports';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

// Connect to the page's MCP server
const transport = new TabClientTransport({
  targetOrigin: window.location.origin
});

const client = new Client({
  name: 'ExtensionProxyClient',
  version: '1.0.0'
});

// Connect to extension background
const backgroundPort = chrome.runtime.connect({
  name: 'mcp-content-script-proxy'
});

// Discover and connect to page server
await client.connect(transport);
const pageTools = await client.listTools();

// Register tools with background hub
backgroundPort.postMessage({
  type: 'register-tools',
  tools: pageTools.tools
});`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Extension UI</h3>
              <CodeBlock
                language="typescript"
                title="popup.tsx"
                isMobile={isMobile}
                code={`import { ExtensionClientTransport } from '@mcp-b/transports';
import { Client } from '@modelcontextprotocol/sdk/client';

// 1. Create extension transport
const transport = new ExtensionClientTransport({
  portName: 'mcp'
});

// 2. Create MCP client
const client = new Client({
  name: 'MyExtensionUI',
  version: '1.0.0',
});

// 3. Connect and use
await client.connect(transport);
const result = await client.callTool({
  name: 'add',
  arguments: { a: 20, b: 22 },
});

console.log('Result from page:', result.content[0].text); // "42"`}
              />
            </div>
          </div>
        </section>

        {/* React Hooks Section */}
        <section id="react-hooks" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">React Hooks</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                @mcp-b/mcp-react-hooks
              </CardTitle>
              <CardDescription>
                React hooks and providers for MCP integration with support for client, server, and
                combined usage
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Installation</h3>
              <CodeBlock
                language="bash"
                code="npm install @mcp-b/mcp-react-hooks"
                isMobile={isMobile}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Client Usage</h3>
              <CodeBlock
                language="typescript"
                title="ClientApp.tsx"
                isMobile={isMobile}
                code={`import { McpClientProvider, useMcpClient } from '@mcp-b/mcp-react-hooks';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { TabClientTransport } from '@mcp-b/transports';

// Create client and transport instances
const client = new Client({ name: 'MyApp', version: '1.0.0' });
const transport = new TabClientTransport('mcp', { clientInstanceId: 'my-app' });

function App() {
  return (
    <McpClientProvider client={client} transport={transport} opts={{}}>
      <ClientTools />
    </McpClientProvider>
  );
}

function ClientTools() {
  const { client, tools, isConnected, isLoading, error } = useMcpClient();

  const callTool = async (toolName: string, args: any) => {
    if (!client) return;

    const result = await client.callTool({
      name: toolName,
      arguments: args
    });

    console.log('Tool result:', result);
  };

  if (isLoading) return <div>Connecting...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Available Tools: {tools.length}</h3>
      {tools.map(tool => (
        <div key={tool.name}>
          <h4>{tool.name}</h4>
          <p>{tool.description}</p>
        </div>
      ))}
    </div>
  );
}`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Server Usage</h3>
              <CodeBlock
                language="typescript"
                title="ServerApp.tsx"
                isMobile={isMobile}
                code={`import { McpServerProvider, useMcpServer } from '@mcp-b/mcp-react-hooks';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TabServerTransport } from '@mcp-b/transports';
import { z } from 'zod';

// Create server and transport instances
const server = new McpServer({
  name: 'MyWebAppServer',
  version: '1.0.0',
  options: { instructions: 'A helpful web application server.' }
});
const transport = new TabServerTransport({ allowedOrigins: ['*'] });

function App() {
  return (
    <McpServerProvider server={server} transport={transport}>
      <ServerTools />
    </McpServerProvider>
  );
}

function ServerTools() {
  const { server, isConnected, registerTool, elicitInput } = useMcpServer();

  useEffect(() => {
    if (!isConnected) return;

    // Register a simple tool
    const unregisterGreet = registerTool(
      'greet',
      {
        description: 'Greets a user by name',
        inputSchema: {
          name: z.string().describe('The name to greet')
        }
      },
      async ({ name }) => ({
        content: [{ type: 'text', text: \`Hello, \${name}!\` }]
      })
    );

    // Cleanup on unmount
    return () => unregisterGreet();
  }, [isConnected, registerTool]);

  return <div>Server connected: {isConnected ? 'Yes' : 'No'}</div>;
}`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Combined Client & Server</h3>
              <CodeBlock
                language="typescript"
                title="MemoryApp.tsx"
                isMobile={isMobile}
                code={`import { McpMemoryProvider, useMcpClient, useMcpServer } from '@mcp-b/mcp-react-hooks';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'MyServer', version: '1.0.0' });
const client = new Client({ name: 'MyClient', version: '1.0.0' });

function App() {
  return (
    <McpMemoryProvider server={server} client={client}>
      <MyApp />
    </McpMemoryProvider>
  );
}

function MyApp() {
  const { registerTool } = useMcpServer();
  const { client, tools } = useMcpClient();

  // Register tools on the server
  useEffect(() => {
    const unregister = registerTool(
      'addNumbers',
      {
        description: 'Adds two numbers',
        inputSchema: {
          a: z.number(),
          b: z.number()
        }
      },
      async ({ a, b }) => ({
        content: [{ type: 'text', text: \`Result: \${a + b}\` }]
      })
    );

    return () => unregister();
  }, [registerTool]);

  // Call tools with the client
  const testAddition = async () => {
    const result = await client.callTool({
      name: 'addNumbers',
      arguments: { a: 5, b: 3 }
    });
    console.log(result);
  };

  return (
    <div>
      <p>Tools: {tools.length}</p>
      <button onClick={testAddition}>Test Addition</button>
    </div>
  );
}`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Integration with Assistant UI</h3>
              <CodeBlock
                language="typescript"
                title="ChatWithMCP.tsx"
                isMobile={isMobile}
                code={`import { useAssistantRuntime } from '@assistant-ui/react';
import { tool } from '@assistant-ui/react';
import { useMcpClient } from '@mcp-b/mcp-react-hooks';

export function useAssistantMCP(mcpTools: McpTool[], client: Client): void {
  const runtime = useAssistantRuntime();

  useEffect(() => {
    if (!client || mcpTools.length === 0) return;

    // Convert MCP tools to assistant-ui tools
    const assistantTools = mcpTools.map((mcpTool) => ({
      name: mcpTool.name,
      assistantTool: tool({
        type: 'frontend',
        description: mcpTool.description,
        parameters: mcpTool.inputSchema,
        execute: async (args) => {
          const result = await client.callTool({
            name: mcpTool.name,
            arguments: args,
          });

          // Extract text content from MCP response
          const textContent = result.content
            .filter(c => c.type === 'text')
            .map(c => c.text)
            .join('\\n');

          return { content: textContent };
        },
      }),
    }));

    // Register with assistant runtime
    const unregister = runtime.registerModelContextProvider({
      getModelContext: () => ({
        system: 'MCP Tools Available:',
        tools: Object.fromEntries(
          assistantTools.map((t) => [t.name, t.assistantTool])
        ),
      }),
    });

    return () => unregister();
  }, [client, mcpTools, runtime]);
}

// Usage in your chat component
function ChatWithMCP() {
  const { client, tools } = useMcpClient();

  // Bridge MCP tools to assistant-ui
  useAssistantMCP(tools, client);

  return <Thread />; // Your assistant-ui Thread component
}`}
              />
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Examples</h2>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Todo Application</CardTitle>
                <CardDescription>
                  A simple todo app that exposes CRUD operations as MCP tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  isMobile={isMobile}
                  code={`server.tool('createTodo', { text: z.string() }, async ({ text }) => {
  const todo = await db.todos.create({ text, completed: false });
  return { content: [{ type: 'text', text: \`Created: \${todo.id}\` }] };
});

server.tool('completeTodo', { id: z.string() }, async ({ id }) => {
  await db.todos.update(id, { completed: true });
  return { content: [{ type: 'text', text: 'Todo completed' }] };
});

server.tool('listTodos', {}, async () => {
  const todos = await db.todos.findAll();
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(todos, null, 2)
    }]
  };
});`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>E-commerce Integration</CardTitle>
                <CardDescription>
                  Expose product search and cart operations to AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  isMobile={isMobile}
                  code={`server.tool(
  'searchProducts',
  { query: z.string(), maxResults: z.number().optional() },
  async ({ query, maxResults = 10 }) => {
    const products = await productAPI.search(query, { limit: maxResults });
    return {
      content: [{
        type: 'text',
        text: products.map(p => \`\${p.name} - $\${p.price}\`).join('\\n')
      }]
    };
  }
);

server.tool(
  'addToCart',
  { productId: z.string(), quantity: z.number() },
  async ({ productId, quantity }) => {
    const item = await cartAPI.addItem(productId, quantity);
    return {
      content: [{
        type: 'text',
        text: \`Added \${quantity}x \${item.name} to cart\`
      }]
    };
  }
);`}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Reference Section */}
        <section id="api-reference" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">API Reference</h2>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>TabServerTransport</CardTitle>
                <CardDescription>Transport for MCP servers running in web pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-sm mb-2">
                      constructor(options?: TabServerTransportOptions)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Creates a new TabServerTransport instance
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-sm mb-2">connect(): Promise&lt;void&gt;</h4>
                    <p className="text-sm text-muted-foreground">
                      Establishes the connection and starts listening for postMessage events
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TabClientTransport</CardTitle>
                <CardDescription>
                  Transport for MCP clients connecting to in-page servers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-sm mb-2">
                      constructor(options: TabClientTransportOptions)
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Creates a new TabClientTransport instance
                    </p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs font-mono mb-1">Parameters:</p>
                      <ul className="text-xs space-y-1">
                        <li>
                          <code>options.targetOrigin</code> - The origin to send messages to
                          (required for security)
                        </li>
                        <li>
                          <code>options.channelId</code> - Optional channel ID (defaults to
                          'mcp-default')
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ExtensionClientTransport</CardTitle>
                <CardDescription>
                  Transport for browser extensions to connect to page MCP servers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-sm mb-2">
                      constructor(options: ExtensionClientTransportOptions)
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Creates a new ExtensionClientTransport instance
                    </p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs font-mono mb-1">Parameters:</p>
                      <ul className="text-xs space-y-1">
                        <li>
                          <code>options.portName</code> - The name of the port to connect to (e.g.,
                          'mcp')
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>React Hooks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-mono text-sm mb-2">useMcpClient()</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Hook for accessing MCP client data and status. Must be used within
                      McpClientProvider.
                    </p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs font-mono mb-1">Returns:</p>
                      <ul className="text-xs space-y-1">
                        <li>
                          <code>client</code> - The MCP Client instance
                        </li>
                        <li>
                          <code>tools</code> - Array of available tools
                        </li>
                        <li>
                          <code>resources</code> - Array of available resources
                        </li>
                        <li>
                          <code>isConnected</code> - Connection status
                        </li>
                        <li>
                          <code>isLoading</code> - Loading state
                        </li>
                        <li>
                          <code>error</code> - Connection error if any
                        </li>
                        <li>
                          <code>capabilities</code> - Server capabilities
                        </li>
                        <li>
                          <code>reconnect</code> - Manual reconnection function
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-sm mb-2">useMcpServer()</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Hook for accessing MCP server functionality. Must be used within
                      McpServerProvider.
                    </p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs font-mono mb-1">Returns:</p>
                      <ul className="text-xs space-y-1">
                        <li>
                          <code>server</code> - The MCP server instance
                        </li>
                        <li>
                          <code>isConnected</code> - Connection status
                        </li>
                        <li>
                          <code>isConnecting</code> - Currently connecting
                        </li>
                        <li>
                          <code>error</code> - Connection error if any
                        </li>
                        <li>
                          <code>registerTool</code> - Register a tool with automatic cleanup
                        </li>
                        <li>
                          <code>elicitInput</code> - Request user input through the client
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-sm mb-2">Provider Props</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-mono mb-1">McpClientProvider:</p>
                        <ul className="text-xs space-y-1">
                          <li>
                            <code>client: Client</code> - MCP client instance
                          </li>
                          <li>
                            <code>transport: Transport</code> - Transport instance
                          </li>
                          <li>
                            <code>opts?: RequestOptions</code> - Connection options
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-mono mb-1">McpServerProvider:</p>
                        <ul className="text-xs space-y-1">
                          <li>
                            <code>server: McpServer</code> - MCP server instance
                          </li>
                          <li>
                            <code>transport: Transport</code> - Transport instance
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-mono mb-1">McpMemoryProvider:</p>
                        <ul className="text-xs space-y-1">
                          <li>
                            <code>server: McpServer</code> - MCP server instance
                          </li>
                          <li>
                            <code>client: Client</code> - MCP client instance
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className={cn(isMobile ? 'space-y-4' : 'flex items-center justify-between')}>
            <p className="text-sm text-muted-foreground">
              MCP-B is not affiliated with Anthropic or the official Model Context Protocol project.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/MiguelsPizza/WebMCP"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="mailto:alexmnahas@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
