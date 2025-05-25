
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

interface Contact {
  id: string;
  full_name: string;
  avatar_url: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
  };
}

export const MessagesPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
      markMessagesAsRead(selectedContact.id);
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      // This is a simplified version - in a real app you'd have a more complex query
      // to get the latest message and unread count for each contact
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;
      
      // Transform to match Contact interface with mock data
      const contactsData = data?.map(profile => ({
        ...profile,
        last_message: 'Click to start conversation',
        last_message_time: new Date().toISOString(),
        unread_count: 0
      })) || [];
      
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      // First get the messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Then get sender profiles for each message
      if (messagesData && messagesData.length > 0) {
        const senderIds = [...new Set(messagesData.map(msg => msg.sender_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', senderIds);

        if (profilesError) throw profilesError;

        // Combine messages with sender profiles
        const messagesWithSenders = messagesData.map(message => ({
          ...message,
          sender: profilesData?.find(profile => profile.id === message.sender_id) || {
            full_name: 'Unknown User',
            avatar_url: ''
          }
        }));

        setMessages(messagesWithSenders);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const markMessagesAsRead = async (contactId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', contactId)
        .eq('recipient_id', user?.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          recipient_id: selectedContact.id,
          content: newMessage.trim()
        });

      if (error) throw error;
      
      setNewMessage('');
      fetchMessages(selectedContact.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B894]"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20">
        {!selectedContact ? (
          // Contacts list
          <div className="px-4">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
              
              <div className="space-y-2">
                {contacts.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No contacts yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  contacts.map((contact) => (
                    <Card 
                      key={contact.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={contact.avatar_url || ''} />
                            <AvatarFallback className="bg-[#00B894] text-white">
                              {contact.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-sm truncate">
                                {contact.full_name}
                              </h3>
                              {contact.unread_count > 0 && (
                                <Badge variant="default" className="bg-[#00B894] text-xs">
                                  {contact.unread_count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {contact.last_message}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          // Chat view
          <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Chat header */}
            <div className="bg-white border-b px-4 py-3 flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedContact(null)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedContact.avatar_url || ''} />
                <AvatarFallback className="bg-[#00B894] text-white text-sm">
                  {selectedContact.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="font-medium">{selectedContact.full_name}</h2>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender_id === user?.id
                          ? 'bg-[#00B894] text-white'
                          : 'bg-white border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user?.id ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Message input */}
            <div className="bg-white border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  size="sm"
                  className="bg-[#00B894] hover:bg-[#00A085]"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
