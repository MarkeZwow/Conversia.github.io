const SUPABASE_URL = 'https://noawhiwgihrcqygsmjed.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYXdoaXdnaWhyY3F5Z3NtamVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTkzMzUsImV4cCI6MjA4NDc3NTMzNX0.MPeLwmSh5Vx12J470W_tbojh5JoUJIhSa0V-Q_a20ow';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadContent() {
    const { data: topic, error: tError } = await supabaseClient
        .from('topics')
        .select('*')
        .limit(1)
        .single();

    if (tError) {
        console.error('Помилка завантаження теми:', tError);
        return;
    }

    if (topic) {
        document.getElementById('topic-title').innerText = topic.title;
        const descElement = document.getElementById('topic-description');
        if (descElement) descElement.innerText = topic.description;
        
        const { data: debateArgs, error: aError } = await supabaseClient
            .from('arguments')
            .select('*')
            .eq('topic_id', topic.id);

        if (aError) {
            console.error('Помилка завантаження аргументів:', aError);
            return;
        }

        const container = document.getElementById('arguments-grid');
        if (container) {
            container.innerHTML = '';

            debateArgs.forEach(arg => {
                const card = `
                    <div class="argument-card ${arg.type}">
                        <span class="badge badge-${arg.type}">${arg.badge_text}</span>
                        <h3>${arg.title}</h3>
                        <p>${arg.text}</p>
                        <small style="color: var(--text-muted)">Репутація автора: +${arg.reputation}</small>
                    </div>
                `;
                container.innerHTML += card;
            });
        }
    }
}

loadContent();