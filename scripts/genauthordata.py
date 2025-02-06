#!/usr/bin/env python3

import argparse
import json
from collections import Counter
import urllib.request as request
import urllib.parse as parse
import time
import ssl

API_URL = "https://en.wikipedia.org/w/api.php"

# Must setup Quotify DB migrations with `php artisan migrate:fresh` before running this script
parser = argparse.ArgumentParser()
parser.add_argument('-i', '--in-file', type=argparse.FileType('r', encoding="utf8"), required=True)
parser.add_argument('-o', '--out-file', type=argparse.FileType('r+', encoding="utf8"), required=True)

args = parser.parse_args()

tags = Counter()
authors = Counter()

for quote in args.in_file:
    quote = quote.rstrip()
    quote_attr = quote.split('|')

    authors[quote_attr[1]] = None
    for tag in quote_attr[2].split(','):
        tags[tag] = None

existing = set()

for line in args.out_file:
    line = line.rstrip()
    existing.add(line.split('|')[0])

for author in authors.keys():
    if author in existing:
        print(f'Author "{author}" already exists in the file, skipping')
        continue

    queryStr1 = { "search": author, 'action': 'opensearch', 'format': 'json', 'namespace': '0' }
    queryStr2 = { "gpssearch": author, 'action': 'query', 'format': 'json', 'prop': 'description', 'generator': 'prefixsearch', 'redirects': '1', 'converttitles': '1', 'formatversion': '2'}

    # Encode the parameters properly
    url1 = API_URL + "?" + parse.urlencode(queryStr1)
    url2 = API_URL + "?" + parse.urlencode(queryStr2)
    wiki_link = ''
    page = ''

    res1 = request.urlopen(request.Request(url1))

    if res1.getcode() == 200:
        content1 = json.loads(res1.read())
        if (content1[3]):
            wiki_link = content1[3][0]

    time.sleep(0.5)

    res2 = request.urlopen(request.Request(url2))

    if res2.getcode() == 200:
        content2 = json.loads(res2.read())
        if ('query' in content2 and 'pages' in content2['query'] and 'description' in content2['query']['pages'][0]):
            page = content2['query']['pages'][0]['description']

    outline = '|'.join([author, wiki_link, page])

    print(f'Writing Line to file: {outline}')
    args.out_file.write(outline + '\n')

    time.sleep(0.5)