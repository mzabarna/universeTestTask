import {APIResponse, request} from '@playwright/test';
import {APIRequestContext} from "playwright";
import {MessageHelper, Mode} from "./createTestData";

require('dotenv').config({path: `.env.local`});

class ApiUtils {

    async makeApiCall(token: string, stream: boolean, mode: Mode = 'normal'): Promise<APIResponse> {
        try {
            const requestContext: APIRequestContext = await request.newContext();
            const createCharSession: string = '/stream/v1/chat/completions'
            const messages = MessageHelper.generateTestMessages(mode);
            return await requestContext.post(process.env.LINK + createCharSession, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    temperature: 0.4,
                    top_p: 1,
                    n: 1,
                    presence_penalty: 0,
                    frequency_penalty: 0,
                    stream: stream,
                    model: 'gpt-4-0125-preview',
                    messages: messages
                },
            });
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    };

    async handleApiResponse(
        response: APIResponse,
        expectedStatus: number,
    ): Promise<any> {
        const status: number = response.status();

        if (status !== expectedStatus) {
            throw new Error(`Expected status ${expectedStatus}, got ${status}`);
        }
        return await response.json()
    }

    async readStreamingResponse(response: APIResponse, expectedStatus: number): Promise<any> {
        const status: number = response.status();

        if (status !== expectedStatus) {
            throw new Error(`Expected status ${expectedStatus}, got ${status}`);
        }

        const body = await response.body();
        const chunks = body.toString().split('\n\n');

        const dataChunks = chunks
            .filter(chunk => chunk.startsWith('data: ') && !chunk.includes('[DONE]'))
            .map(chunk => {
                const jsonPart = chunk.replace('data: ', '');
                return JSON.parse(jsonPart);
            });

        return dataChunks;
    }
}

export const apiUtils = new ApiUtils();



