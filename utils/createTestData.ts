export type Role = 'system' | 'user' | 'assistant' | 'invalid';
export type Mode = 'normal' | 'invalid';

export type Message = {
    role: Role;
    content: string;
};

export class MessageHelper {

    static generateTestMessages(mode: Mode = 'normal'): Message[] {
        if (mode === 'normal') {
            return [
                {
                    role: 'system',
                    content: 'You are Assist – users\' personal assistant developed by team from Ukraine. Answer as concisely as possible. Current date: Aug 15 2023, current time: 16:07, user\'s country: United States.'
                },
                {
                    role: 'user',
                    content: 'Provide workout routines to target specific muscle groups for maximum results'
                },
                {
                    role: 'assistant',
                    content: ''
                }
            ];
        } else {
            return [
                {
                    role: 'invalid',
                    content: ''
                },
                {
                    role: 'invalid',
                    content: 'bla bla bla'
                }
            ];
        }
    }
}
