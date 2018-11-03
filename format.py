import re
f = open('./test.txt', 'r')
lines = str(f.read())
print('123');
r = re.split(r'—————\s*|重点词汇|拓展内容',lines)
yw = r[0]
source = re.match(r'文章来源 /\s(.+)\s*',r[1]).groups()[0].strip()
lines = r[2].split('\n');
lines.map(lambda v:)
for line in lines:
    match = re.match(r'(\w*)\s/', line)
    if match:
        print(match.groups()[0])

words = re.findall(r'\n(\w*)\s/',r[2])
