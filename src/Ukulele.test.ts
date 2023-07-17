type Note = string;

const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const UKULELE_TUNING: Note[] = ['D', 'G', 'B', 'E'];

function getFretNotes(barreFret: number, upToFret: number): Note[][] {
    let fretNotes: Note[][] = [];

    for (let stringNote of UKULELE_TUNING) {
        let stringNotes: Note[] = [];
        let noteIndex = NOTES.indexOf(stringNote);

        for (let fret = barreFret; fret <= upToFret; fret++) {
            stringNotes.push(NOTES[(noteIndex + fret) % NOTES.length]);
        }

        fretNotes.push(stringNotes);
    }

    return fretNotes;
}

const MAJOR_SCALE_PATTERN: number[] = [2, 2, 1, 2, 2, 2, 1];

function getScaleDegrees(notes: Note[], key: Note): ScaleDegree[] {
    let keyIndex = NOTES.indexOf(key);
    let scaleNotes: Note[] = [];

    let currentIndex = keyIndex;
    for (let step of MAJOR_SCALE_PATTERN) {
        scaleNotes.push(NOTES[currentIndex % NOTES.length]);
        currentIndex += step;
    }

    let scaleDegrees: ScaleDegree[] = notes.map(note => {
        let degree = scaleNotes.indexOf(note);
        return degree === -1 ? 'X' : degree + 1;
    });

    return scaleDegrees;
}

type UkulelePosition = [ScaleDegree, ScaleDegree[], number[]];

function findChords(availables: ScaleDegree[][]): UkulelePosition[] {
    let allFretCombinations = generateFretCombinations(availables);
    console.log('a', availables, allFretCombinations) //?
    let chords: UkulelePosition[] = [];

    for (let fretCombination of allFretCombinations) {

        let degrees = fretCombination.map((fret, string) => availables[string][fret]);
        let chord = getChord(degrees as number[]);
        if (chord[1] == 'invalid') continue

        let r = [chord[0], degrees, fretCombination] as UkulelePosition;
        chords.push(r);
    }

    return chords;
}

function generateFretCombinations(scaleDegrees: ScaleDegree[][], fretCombination: number[] = []): number[][] {
    if (fretCombination.length === scaleDegrees.length) {
        return [fretCombination];
    } else {
        let combinations: number[][] = [];
        let stringDegrees = scaleDegrees[fretCombination.length];

        for (let fret = 0; fret < stringDegrees.length; fret++) {
            if (stringDegrees[fret] !== 'X') {
                combinations.push(...generateFretCombinations(scaleDegrees, [...fretCombination, fret]));
            }
        }

        return combinations;
    }
}


type ScaleDegree = number | 'X';
type Semitones = number | 'X';
type ChordType = 'major' | 'minor' | 'major7' | 'minor7' | 'dominant7' | 'diminished' | 'invalid';


type Chord = [Note, ChordType]

const CHORDS: { [type in ChordType]: Semitones[] } = {
    'major': [0, 4, 7],
    'minor': [0, 3, 7],
    'major7': [0, 4, 7, 11],
    'minor7': [0, 3, 7, 10],
    'dominant7': [0, 4, 7, 10],
    'diminished': [0, 3, 6],
    'invalid': []
};

function scaleDegreesToSemitones(scaleDegrees: ScaleDegree[]): Semitones[] {
    const majorScaleSemitones: Semitones[] = [0, 2, 4, 5, 7, 9, 11];

    return scaleDegrees.map(degree =>
        degree === 'X' ? 'X' : majorScaleSemitones[(degree - 1) % 7]
    );
}

function semitoneToNoteInCMajor(semitone: Semitones): Note {
    const majorScaleSemitones: Semitones[] = [0, 2, 4, 5, 7, 9, 11];
    const majorScaleNotes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    let index = majorScaleSemitones.indexOf(semitone);
    return majorScaleNotes[index];
}

function getChord(degrees: ScaleDegree[]): Chord {
    let semitones = scaleDegreesToSemitones(degrees);
    let numericSemitones = semitones.filter(semitone => semitone !== 'X') as number[];

    if (numericSemitones.length !== semitones.length) {
        return ['X', 'invalid'];
    }

    let sortedSemitones = Array.from(new Set(numericSemitones)).sort((a, b) => a - b);

    for (let j = 0; j < sortedSemitones.length; j++) {
        let rootSemitone = sortedSemitones[j];
        let intervals = sortedSemitones.map(semitone => (semitone - rootSemitone + 12) % 12)
            .sort((a, b) => a - b);

        let chordType = (Object.keys(CHORDS) as ChordType[]).find(chordType => arraysEqual(CHORDS[chordType], intervals));
        if (chordType && chordType != 'invalid') {
            let rootNote = semitoneToNoteInCMajor(rootSemitone)
            return [rootNote, chordType];
        }
    }

    return ['X', 'invalid'];
}


function arraysEqual(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function getOpenChordPosition(frets: number[]): string {
    // Get the notes for each string at the specified fret
    let notes = frets.map((fret, string) => NOTES[(NOTES.indexOf(UKULELE_TUNING[string]) + fret) % NOTES.length]);

    // Get the chord for the notes
    let [rootNote, chordType] = getChord(notes.map(note => NOTES.indexOf(note) % 7 + 1));

    // Return the chord position name
    return rootNote !== 'X' ? `${rootNote} ${chordType}` : 'No chord';
}


describe('Ukulele', () => {
    it.only('works', async () => {
        const barre = 2;
        let testSet = getFretNotes(barre, barre + 4);


        let prep = testSet.map(notes => getScaleDegrees(notes, 'C'))
        let r = findChords(prep);
        let str = "| Root | Frets | Notes | Open Chord Shape | Frets (Barre) |\n";
        str += "|------|-------|-------|------------------|---------------|\n";
        for (let i of r) {
            let frets = i[2].map(z => z + barre);
            let openChordName = getOpenChordPosition(frets);
            str += `| ${i[0]} | ${frets.join(' ')} | ${i[1]} | ${openChordName} | ${i[2].join(' ')} |\n`;
        }
        console.log(str);
    })
})

describe('isValidChord', () => {
    it.only('identifies the 5th chord in a major scale, its 7th version and their inversions', () => {
        // 5th chord in C Major: G, B, D (root, 3rd, 5th)
        // expect(getChord([5, 7, 2])).toEqual(['G', 'major']);
        //
        // 5th 7th chord in C Major: G, B, D, F (root, 3rd, 5th, 7th)
        expect(getChord([5, 7, 2, 4])).toEqual(['G', 'dominant7']);

        // 1st inversion: B, D, G (3rd, 5th, root)
        expect(getChord([7, 2, 5])).toEqual(['G', 'major']);

        // 1st inversion of 7th chord: B, D, F, G (3rd, 5th, 7th, root)
        expect(getChord([7, 2, 4, 5])).toEqual(['G', 'dominant7']);

        // 2nd inversion: D, G, B (5th, root, 3rd)
        expect(getChord([2, 5, 7])).toEqual(['G', 'major']);

        // 2nd inversion of 7th chord: D, F, G, B (5th, 7th, root, 3rd)
        expect(getChord([2, 4, 5, 7])).toEqual(['G', 'dominant7']);

        // B chord in C Major: B, D#, F# (root, 3rd, 5th)
        expect(getChord([7, 2, 4])).toEqual(['B', 'diminished']);

        // 1st inversion: D#, F#, B (3rd, 5th, root)
        expect(getChord([2, 4, 7])).toEqual(['B', 'diminished']);

        // 2nd inversion: F#, B, D# (5th, root, 3rd)
        expect(getChord([4, 7, 2])).toEqual(['B', 'diminished']);

    });
});

describe('getFretNotes', () => {
    it('returns the correct notes for each fret', () => {
        const expectedNotes = [
            ['E', 'F', 'F#', 'G', 'G#'],
            ['A', 'A#', 'B', 'C', 'C#'],
            ['C#', 'D', 'D#', 'E', 'F'],
            ['F#', 'G', 'G#', 'A', 'A#']
        ];
        let r = getFretNotes(2, 6); //?

        expect(r).toEqual(expectedNotes);
    });
});

import { Chord } from 'tonal';

const chord = Chord.detect(["D", "F#", "A", "C"]);
console.log(chord); // Outputs: [ 'D7' ]
