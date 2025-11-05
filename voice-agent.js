import { Conversation } from 'https://cdn.jsdelivr.net/npm/@11labs/client/+esm';

let currentConversation = null;
let isActive = false;

export async function startVoiceAgent(agentId, onStatusChange, language = 'en') {
    if (isActive && currentConversation) {
        console.log('Conversation already active');
        return;
    }

    try {
        onStatusChange('connecting', 'Connecting...');

        currentConversation = await Conversation.startSession({
            agentId: agentId,
            language: language,

            onConnect: () => {
                console.log('✅ Voice agent connected');
                isActive = true;
                onStatusChange('connected', 'Listening...');
            },

            onDisconnect: () => {
                console.log('Voice agent disconnected');
                isActive = false;
                onStatusChange('disconnected', 'Click to talk');
                currentConversation = null;
            },

            onMessage: (message) => {
                console.log('Message:', message);
                if (message.type === 'user_transcript') {
                    onStatusChange('speaking', 'You: ' + message.text);
                } else if (message.type === 'agent_response') {
                    onStatusChange('responding', 'Agent: ' + message.text);
                }
            },

            onError: (error) => {
                console.error('Voice agent error:', error);
                onStatusChange('error', 'Error: ' + error.message);
                isActive = false;
                currentConversation = null;
            },

            onModeChange: (mode) => {
                console.log('Mode changed:', mode);
                if (mode === 'listening') {
                    onStatusChange('listening', 'Listening...');
                } else if (mode === 'speaking') {
                    onStatusChange('agent_speaking', 'Agent speaking...');
                }
            }
        });

    } catch (error) {
        console.error('Failed to start conversation:', error);
        onStatusChange('error', 'Failed to start: ' + error.message);
        isActive = false;
    }
}

export async function stopVoiceAgent() {
    if (currentConversation) {
        await currentConversation.endSession();
        currentConversation = null;
        isActive = false;
    }
}

export function isConversationActive() {
    return isActive;
}
