

letters = 'qwertyuiopasdfghjklzxcvbnm'

keyboard_neighbours = {
  "q": ["w", "a"],
  "w": ["q", "s", "e"],
  "e": ["w", "d", "r"],
  "r": ["e", "f", "t"],
  "t": ["r", "g", "y"],
  "y": ["t", "h", "u"],
  "u": ["y", "j", "i"],
  "i": ["u", "k", "o"],
  "o": ["i", "l", "p"],
  "p": ["o", "l"],
  "a": ["q", "s", "z"],
  "s": ["a", "w", "d", "x", "z"],
  "d": ["s", "e", "f", "c", "x"],
  "f": ["d", "r", "g", "v", "c"],
  "g": ["f", "t", "h", "b", "v"],
  "h": ["g", "y", "j", "n", "b"],
  "j": ["h", "u", "k", "m", "n"],
  "k": ["j", "i", "l", "m"],
  "l": ["k", "o"],
  "z": ["a", "s", "x"],
  "x": ["z", "s", "d", "c"],
  "c": ["x", "d", "f", "v"],
  "v": ["c", "f", "g", "b"],
  "b": ["v", "g", "h", "n"],
  "n": ["b", "h", "j", "m"],
  "m": ["n", "j", "k"]
}

with open('sample_text.txt') as f:
    text = f.read()

text = text.lower()
text = [chr for chr in text if chr in letters]
transitions = [[0]*26 for _ in range(26)]

for i in range(len(text)-1):
    previous_chr = text[i]
    next_chr = text[i+1]
    transitions[ord(previous_chr)-97][ord(next_chr)-97] += 1

for i in range(26):
    row_total = sum(transitions[i])
    transitions[i] = [count/row_total for count in transitions[i]]
    printable_row = [float('{:.2f}'.format(prob)) for prob in transitions[i]]
    print(printable_row, ",")
