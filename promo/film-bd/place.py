# Pose chaque bloc de voix à son moment (format « moment · phrase · à l'image ») et réécrit les repères de mots.
import json, subprocess, re, sys
SRC_WAV, SRC_JSON = 'assets/voice-kokoro.wav', 'assets/voice-kokoro.words.json'
GROUPS = [[0,1,2],[3,4],[5],[6,7],[8],[9],[10],[11,12]]   # phrases de la synthèse → blocs 1..8
STARTS = [0.3, 8.3, 15.6, 25.0, 33.0, 39.3, 44.3, 50.6]     # début de chaque bloc dans le film (s)
d = json.load(open(SRC_JSON)); S = d['sentences']
words = []; parts = []
for i, (g, st) in enumerate(zip(GROUPS, STARTS)):
    a, b = S[g[0]]['start'], S[g[-1]]['end']
    shift = st - a
    parts.append((a, b, st))
    for w in d['words']:
        if a - 0.01 <= w['start'] <= b + 0.01:
            words.append({'word': w['word'], 'start': round(w['start'] + shift, 3), 'end': round(w['end'] + shift, 3), 'block': i + 1})
# assemblage audio
inputs = []; filt = []
for j, (a, b, st) in enumerate(parts):
    inputs += ['-i', SRC_WAV]
    ms = int(st * 1000)
    filt.append(f'[{j}:a]atrim={a:.3f}:{b+0.05:.3f},asetpts=PTS-STARTPTS,adelay={ms}|{ms}[v{j}]')
filt.append(''.join(f'[v{j}]' for j in range(len(parts))) + f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur=60[out]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt), '-map', '[out]', '-ar', '48000', '-t', '60', 'assets/voice.wav'], check=True)
json.dump({'words': words}, open('assets/cues.json', 'w'), ensure_ascii=False)
h = open('index.html').read()
blob = json.dumps({'words': words}, ensure_ascii=False)
h = re.sub(r'<script type="application/json" id="om-cues">.*?</script>', '<script type="application/json" id="om-cues">' + blob + '</script>', h, flags=re.S)
open('index.html', 'w').write(h)
print(' | '.join(f"{w['word']}@{w['start']:.2f}" for w in words))
