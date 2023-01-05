// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require('electron');
const moment = require('moment');

// vue context
var vm;
let audio = new Audio();
var music_files = [];
let music_file_index_now = 0;

// env
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

// Add the event listener for the response from the main process
ipcRenderer.on('request-playmusic-action-response', (event, arg) => {
    vm.play_music_files(arg)
});

window.onload = function () {
    vm = new Vue({
        el: '#box',
        data: {
            alert_message: "",

            media_url: "",
            music_dir: "",

            player_tr: 1,
            player_td: 0,

            music_player_started: false,
        },
        mounted: function () {
        },
        methods: {

            append_player(media_url) {
                if (this.player_td >= 4) {
                    this.player_tr++;
                    this.player_td = 0;
                } else {
                    this.player_td++;
                }

                let container_name = "container" + this.player_tr + "_" + this.player_td;
                this.play(container_name, media_url);
            },

            play(container, media_url) {
                let mse = window.MediaSource && window.MediaSource.isTypeSupported('video/mp4; codecs="hev1.1.6.L123.b0"');
                let player = new JessibucaPro({
                    container: document.getElementById(container),
                    decoder: 'static/jessibuca/decoder-pro.js',
                    videoBuffer: 0.2,
                    autoWasm: true,
                    loadingText: "加载中...",
                    forceNoOffscreen: true,
                    isNotMute: false,
                    useMSE: true,
                    watermarkConfig: {
                        text: {
                            content: 'MSE: ' + mse
                        },
                        right: 10,
                        top: 10
                    },
                });
                player.play(media_url);
            },

            detect_music_files() {
                ipcRenderer.send('request-playmusic-action', this.music_dir);
            },

            reload_music_file() {
                music_file_index_now++;
                if (music_file_index_now == music_files.length) {
                    music_file_index_now = 0;
                }

                console.log("切换播放---->" + music_files[music_file_index_now]);
                audio.pause();
                audio.setAttribute('src', music_files[music_file_index_now]);
                audio.load();
                audio.play();
            },

            play_music_files(arg) {
                let self = this;

                music_files = [];
                for (const v of arg) {
                    if (v.split('.').pop().toLowerCase() == "mp3" || v.split('.').pop().toLowerCase() == "wav" || v.split('.').pop().toLowerCase() == "falc") {
                        music_files.push(v);
                    }
                }

                console.log("播放列表---->" + music_files);

                audio.addEventListener('error', function failed(e) {
                    self.alert_message = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss") + " 播放 [" + decodeURI(e.target.src) + "] 出错, 错误码: " + e.target.error.code;
                    self.reload_music_file();
                }, true);

                if (music_files.length > 0) {
                    audio.src = music_files[music_file_index_now];
                    audio.load();
                    audio.play();

                    this.music_player_started = true;
                    console.log("开始播放---->" + audio.src);

                    setInterval(() => {
                        if (audio.currentTime >= audio.duration) {
                            self.reload_music_file();
                        }
                    }, 100);
                }
            },

        }
    });
}