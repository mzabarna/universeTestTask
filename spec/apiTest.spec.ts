import {apiUtils} from "../utils/apiUtils"
import {APIResponse, expect, test} from '@playwright/test';
require('dotenv').config({path: `.env.local`});

test('Check user API returns correct fields Scenario 1', async () => {
    const response: APIResponse = await apiUtils.makeApiCall(process.env.TOKEN, false);
    const responseBody = await apiUtils.handleApiResponse(response, 200);
    expect(responseBody.id).toContain('chatcmpl')
    expect(responseBody.object).toEqual('chat.completion')
    expect(responseBody.model).toEqual('gpt-4o-mini-2024-07-18')
    expect(Array.isArray(responseBody.choices)).toBeTruthy();
    expect(responseBody.choices[0]).toMatchObject({
        index: expect.any(Number),
        message: {
            role: 'assistant',
            content: expect.any(String),
        },
    });
});

test('invalid token Scenario 2', async () => {
    const invalidToken: string = '1111'
    const response: APIResponse = await apiUtils.makeApiCall(invalidToken, false);
    const responseBody = await apiUtils.handleApiResponse(response, 401);
    expect(responseBody.message).toEqual('Unauthorized')
});

test('invalid parameter "message" Scenario 3', async () => {
    const response: APIResponse = await apiUtils.makeApiCall(process.env.TOKEN, false, 'invalid');
    const responseBody = await apiUtils.handleApiResponse(response, 500);
    expect(responseBody.message).toEqual('Request failed with status code 400')
});

test('invalid parameter "stream" Scenario 4', async () => {
    // @ts-ignore
    const response: APIResponse = await apiUtils.makeApiCall(process.env.TOKEN, 1);
    const responseBody = await apiUtils.handleApiResponse(response, 500);
    expect(responseBody.message).toEqual('Request failed with status code 400')
});

test('Positive scenario: stream = true returns chunked responses with delta Scenario 5', async () => {
    test.setTimeout(200_000)
    const response = await apiUtils.makeApiCall(process.env.TOKEN, true);

    const dataChunks = await apiUtils.readStreamingResponse(response, 200);

    expect(dataChunks.length).toBeGreaterThan(0);

    for (const chunk of dataChunks) {
        expect(chunk).toHaveProperty('choices');
        expect(chunk.choices[0]).toHaveProperty('delta');
    }
});