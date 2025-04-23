# Test info

- Name: invalid parameter "stream" Scenario 4
- Location: /Users/m.zabarna/universeTestTask/spec/apiTest.spec.ts:44:5

# Error details

```
Error: apiRequestContext.post: Request timed out after 1000ms
Call log:
  - → POST https://automation-qa-test.universeapps.limited/stream/v1/chat/completions
    - user-agent: Playwright/1.52.0 (x64; macOS 14.5) node/22.6
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Content-Type: application/json
    - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIxYjY4MC1hNmVmLTQzMGMtODhiZC02MTI5ZGY5MTc5YjMiLCJjcmVhdGVkX2F0IjoiMjAyNS0wMi0yOFQxNDowMTowOC4yODNaIiwiY3JlYXRlZEF0IjoiMjAyNS0wMi0yOFQxNDowMTowOC4yODNaIiwiaWF0IjoxNzQwNzUxMjY4LCJleHAiOjE3NDA3NTIxNjh9.nvgpPryJe9Y5jn5DP2D9YAU_yNZAV7pW913VgxusTyU
    - content-length: 494

    at ApiUtils.makeApiCall (/Users/m.zabarna/universeTestTask/utils/apiUtils.ts:14:41)
    at /Users/m.zabarna/universeTestTask/spec/apiTest.spec.ts:52:35
```

# Test source

```ts
   1 | import {APIResponse, request} from '@playwright/test';
   2 | import {APIRequestContext} from "playwright";
   3 | import {MessageHelper, Mode} from "./createTestData";
   4 |
   5 | require('dotenv').config({path: `.env.local`});
   6 |
   7 | class ApiUtils {
   8 |
   9 |     async makeApiCall(token: string, stream: boolean, mode: Mode = 'normal'): Promise<APIResponse> {
  10 |         try {
  11 |             const requestContext: APIRequestContext = await request.newContext();
  12 |             const createCharSession: string = '/stream/v1/chat/completions'
  13 |             const messages = MessageHelper.generateTestMessages(mode);
> 14 |             return await requestContext.post(process.env.LINK + createCharSession, {
     |                                         ^ Error: apiRequestContext.post: Request timed out after 1000ms
  15 |                 timeout: 1_000,
  16 |                 headers: {
  17 |                     'Content-Type': 'application/json',
  18 |                     Authorization: token
  19 |                 },
  20 |                 data: {
  21 |                     temperature: 0.4,
  22 |                     top_p: 1,
  23 |                     n: 1,
  24 |                     presence_penalty: 0,
  25 |                     frequency_penalty: 0,
  26 |                     stream: stream,
  27 |                     model: 'gpt-4-0125-preview',
  28 |                     messages: messages
  29 |                 },
  30 |             });
  31 |         } catch (error) {
  32 |             console.error('API call failed:', error);
  33 |             throw error;
  34 |         }
  35 |     };
  36 |
  37 |     async handleApiResponse(
  38 |         response: APIResponse,
  39 |         expectedStatus: number,
  40 |     ): Promise<any> {
  41 |         const status: number = response.status();
  42 |
  43 |         if (status !== expectedStatus) {
  44 |             throw new Error(`Expected status ${expectedStatus}, got ${status}`);
  45 |         }
  46 |         return await response.json()
  47 |     }
  48 |
  49 |     async readStreamingResponse(response: APIResponse, expectedStatus: number): Promise<any> {
  50 |         const status: number = response.status();
  51 |
  52 |         if (status !== expectedStatus) {
  53 |             throw new Error(`Expected status ${expectedStatus}, got ${status}`);
  54 |         }
  55 |
  56 |         const body = await response.body();
  57 |         const chunks = body.toString().split('\n\n');
  58 |
  59 |         const dataChunks = chunks
  60 |             .filter(chunk => chunk.startsWith('data: ') && !chunk.includes('[DONE]'))
  61 |             .map(chunk => {
  62 |                 const jsonPart = chunk.replace('data: ', '');
  63 |                 return JSON.parse(jsonPart);
  64 |             });
  65 |
  66 |         return dataChunks;
  67 |     }
  68 | }
  69 |
  70 | export const apiUtils = new ApiUtils();
  71 |
  72 |
  73 |
  74 |
```