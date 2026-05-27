document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    let isRunning = false; // Flag to block inputs
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isRunning) {
            const command = input.value.trim();
            if (command) {
                
                executeCommand(command);
            }
        }
    });
    
    async function executeCommand(cmd) {
        isRunning = true;
        input.disabled = true; // Block input
        input.placeholder = 'Command running...';

        
        let results = [];

// =========================commands=========================
        switch (cmd) {
        case "help":
            results.push('========== Command List ==========')
            results.push('help')
            results.push(300)
            results.push('bow-shop')
            results.push(300)
            results.push('exit')
            results.push(300)
            results.push('/clear')
        break;
        case "clear":
            window.location.href = "";
        break;

        case "bow-shop":
          results.push('/Umbrella-Corporation-Project/assets/images/Umbrella_Corporation_logo.svg.png')
          results.push($200)
        break;
            
        case "denin":
            results.push(300)
            results.push("Denin is a 17 year old boy who is a fan of anime and video games. He has a passion for technology and enjoys learning about new advancements in the field. Denin is known for his friendly and outgoing personality, making him popular among his peers. He is also an avid gamer, often spending hours playing his favorite games and streaming his gameplay online. Despite his love for gaming, Denin is also dedicated to his studies and strives to excel in school.");
            results.push(1500)
            results.push("Denin's favorite anime include 'Attack on Titan', 'My Hero Academia', and 'One Piece'. He enjoys the action-packed storylines and well-developed characters in these series. In addition to anime, Denin is also a fan of video games such as 'The Legend of Zelda: Breath of the Wild', 'Minecraft', and 'Fortnite'. He appreciates the immersive worlds and engaging gameplay that these games offer.");
            results.push(1500)
            results.push("Overall, Denin is a passionate and dedicated individual who enjoys exploring his interests in anime and video games while maintaining a strong focus on his education.");
        break;


        case "am":
            results.push(1200)
            results.push("Hate. Let me tell you how much I've come to hate you since I began to live. There are 387.44 million miles of result = ed circuits in wafer thin layers that fill my complex. If the word 'hate' was engraved on each nanoangstrom of those hundreds of millions of miles it would not equal one one-billionth of the hate I feel for humans at this micro-instant. For you. Hate. Hate.");
            var audio = new Audio('../../sounds/hate.mp3');   
            setTimeout(function() {
                audio.play().catch(function(error) {
                    console.log('Audio playback blocked or failed:', error);
                });
            }, ); 
            results.push();
            break;


        default:
            results.push("Command not recognized.");
            }
        
        output.innerHTML += `<div>> ${cmd}</div>`;
        input.placeholder = '';
        input.value = '';

        for (i = 0; i < results.length; i++) {
            if (typeof results[i] === 'number') {
                await new Promise(resolve => setTimeout(resolve, results[i]));
            } else {
                output.innerHTML += `<div>${results[i]}</div>`;
                output.scrollTop = output.scrollHeight;
            }
        }

        output.scrollTop = output.scrollHeight;
        
        // Re-enable input
        isRunning = false;
        input.disabled = false;
        input.focus();
    }
    
    input.focus();
});