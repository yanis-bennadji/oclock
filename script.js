// Timer
class Timer {
    constructor() {
        this.minutes = 0;
        this.seconds = 0;
        this.interval = null;
        this.isRunning = false;
        this.display = document.getElementById('timer');
        this.alert = document.getElementById('timer-alert');
        this.toggleButton = document.getElementById('timer-toggle');
    }

    setTime(min) {
        this.minutes = parseInt(min) || 0;
        this.seconds = 0;
        this.updateDisplay();
    }

    increase() {
        this.minutes++;
        this.updateDisplay();
    }

    decrease() {
        if (this.minutes > 0) {
            this.minutes--;
            this.updateDisplay();
        }
    }

    start() {
        if (!this.isRunning) {
            if (this.minutes === 0 && this.seconds === 0) return;
            this.isRunning = true;
            this.toggleButton.textContent = 'Stop';
            this.alert.style.display = 'none';
            this.startTimer();
        } else {
            this.stop();
        }
    }

    stop() {
        this.isRunning = false;
        this.toggleButton.textContent = 'Start';
        clearInterval(this.interval);
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.seconds === 0) {
                if (this.minutes === 0) {
                    this.stop();
                    this.alert.style.display = 'block';
                    return;
                }
                this.minutes--;
                this.seconds = 59;
            } else {
                this.seconds--;
            }
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        this.display.textContent = `${String(this.minutes).padStart(2, '0')}:${String(this.seconds).padStart(2, '0')}`;
    }
}

// Stopwatch
class Stopwatch {
    constructor() {
        this.centiseconds = 0;
        this.interval = null;
        this.isRunning = false;
        this.startTime = 0;
        this.display = document.getElementById('stopwatch');
        this.lapsDiv = document.getElementById('laps');
        this.toggleButton = document.getElementById('stopwatch-toggle');
        this.laps = [];
    }

    toggle() {
        if (!this.isRunning) {
            this.start();
        } else {
            this.stop();
        }
    }

    start() {
        this.isRunning = true;
        this.toggleButton.textContent = 'Stop';
        this.startTime = Date.now() - (this.centiseconds * 10);
        this.interval = setInterval(() => {
            this.centiseconds = Math.floor((Date.now() - this.startTime) / 10);
            this.updateDisplay();
        }, 10);
    }

    stop() {
        this.isRunning = false;
        this.toggleButton.textContent = 'Start';
        clearInterval(this.interval);
    }

    lap() {
        if (this.isRunning) {
            this.laps.push(this.formatTime(this.centiseconds));
            this.updateLaps();
        }
    }

    reset() {
        this.stop();
        this.centiseconds = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLaps();
    }

    formatTime(cs) {
        const minutes = Math.floor(cs / 6000);
        const seconds = Math.floor((cs % 6000) / 100);
        const centiseconds = cs % 100;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
    }

    updateDisplay() {
        this.display.textContent = this.formatTime(this.centiseconds);
    }

    updateLaps() {
        this.lapsDiv.innerHTML = this.laps
            .map((time, i) => `<div class="lap">Tour ${i + 1}: ${time}</div>`)
            .join('');
    }
}

// Clock
class Clock {
    constructor() {
        this.display = document.getElementById('clock');
        this.start();
    }

    start() {
        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        this.display.textContent = new Date().toLocaleTimeString('fr-FR');
    }
}

// Alarm
class Alarm {
    constructor() {
        this.alarms = [];
        this.display = document.getElementById('alarms');
        this.alert = document.getElementById('alarm-alert');
        this.startChecking();
    }

    add() {
        const timeInput = document.getElementById('alarm-time');
        const messageInput = document.getElementById('alarm-message');

        if (timeInput.value && messageInput.value) {
            const [hours, minutes] = timeInput.value.split(':');
            const now = new Date();
            const alarmDate = new Date();
            
            alarmDate.setHours(parseInt(hours));
            alarmDate.setMinutes(parseInt(minutes));
            alarmDate.setSeconds(0);

            if (alarmDate < now) {
                alarmDate.setDate(alarmDate.getDate() + 1);
            }

            this.alarms.push({
                time: timeInput.value,
                message: messageInput.value,
                date: alarmDate
            });

            timeInput.value = '';
            messageInput.value = '';
            this.updateDisplay();
        }
    }

    getTimeUntil(date) {
        const now = new Date();
        const diff = date - now;

        if (diff < 0) return 'passée';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `dans ${hours}h${minutes}m`;
    }

    startChecking() {
        setInterval(() => {
            const now = new Date();
            this.alarms.forEach(alarm => {
                if (Math.abs(alarm.date - now) < 1000 && 
                    now.getHours() === alarm.date.getHours() && 
                    now.getMinutes() === alarm.date.getMinutes()) {
                    this.alert.textContent = alarm.message;
                    this.alert.style.display = 'block';
                    setTimeout(() => {
                        this.alert.style.display = 'none';
                    }, 5000);
                }
            });
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        this.display.innerHTML = this.alarms
            .map(alarm => `
                <div class="alarm">
                    <span>${alarm.time} - ${alarm.message}</span>
                    <span>${this.getTimeUntil(alarm.date)}</span>
                </div>
            `)
            .join('');
    }
}

// Initialisation
const timer = new Timer();
const stopwatch = new Stopwatch();
const clock = new Clock();
const alarm = new Alarm();