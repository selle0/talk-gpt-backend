import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
    private openai: OpenAI;
    private conversationHistory: {
        role: "function" | "user" | "system" | "assistant";
        content: string;
    }[] = [];
    constructor(){
        this.openai = new OpenAI({
        apiKey : process.env.OPENAI_API_KEY,
    });   
    }

    async chatWithGPT(content: string) {
        this.conversationHistory.push({
            role: "user",
            content: content,
        });
    
        const chatCompletionMessages = this.conversationHistory.map(message => {
            return {
                role: message.role,
                content: message.content,
                name: "desired_name", // Asegúrate de proporcionar un nombre adecuado aquí
            };
        });
    
        const chatCompletion = await this.openai.chat.completions.create({
            messages: [
                { role: "system", content: "you are a helpful assistant", name: "system" },
                ...chatCompletionMessages,
            ],
            model: "gpt-3.5-turbo",
        });
    
        this.conversationHistory.push({
            role: "assistant",
            content: chatCompletion.choices[0].message.content,
        });

        return chatCompletion.choices[0].message.content;
    }
}