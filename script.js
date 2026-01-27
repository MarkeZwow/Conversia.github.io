const SUPABASE_URL = 'https://noawhiwgihrcqygsmjed.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYXdoaXdnaWhyY3F5Z3NtamVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTkzMzUsImV4cCI6MjA4NDc3NTMzNX0.MPeLwmSh5Vx12J470W_tbojh5JoUJIhSa0V-Q_a20ow';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadContent() {
    const { data: topic, error: tError } = await supabaseClient
        .from('topics')
        .select('*')
        .eq('status', 'active')
        .limit(1)
        .single();

    if (topic) {
        document.getElementById('topic-title').innerText = topic.title;
        document.getElementById('topic-description').innerText = topic.description;
        
        const { data: debateArgs, error: aError } = await supabaseClient
            .from('arguments')
            .select('*')
            .eq('topic_id', topic.id);

        const container = document.getElementById('arguments-grid');
        if (container && debateArgs) {
            container.innerHTML = ''; 

            debateArgs.forEach(arg => {
                const cardType = arg.arg_type === 'con' ? 'contra' : arg.arg_type;

                const card = `
                    <div class="argument-card ${cardType}">
                        <span class="badge badge-${cardType}">${arg.badge_text || 'Аргумент'}</span>
                        <h3>${arg.title || 'Без назви'}</h3>
                        <p>${arg.content}</p> 
                        <small style="color: var(--text-muted)">Автор: ${arg.author_name} | Репутація: +${arg.reputation}</small>
                    </div>
                `;
                container.innerHTML += card;
            });
        }
    }
}

loadContent();