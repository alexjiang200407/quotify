#!/usr/bin/env python3

import argparse
import pymysql

def getlastid(cursor):
    cursor.execute('SELECT LAST_INSERT_ID()')
    lastid = cursor.fetchone()['LAST_INSERT_ID()']
    return lastid

def getexistingid(cursor, table, col, op, val):
    cursor.execute(f'SELECT id FROM `{table}` WHERE {col} {op} %s', (val))
    existingid = cursor.fetchone()['id']
    return existingid

parser = argparse.ArgumentParser()
parser.add_argument('-a', '--authors-file', type=argparse.FileType('r', encoding="utf8"), required=True)
parser.add_argument('-q', '--quotes-file', type=argparse.FileType('r', encoding="utf8"), required=True)
parser.add_argument('-s', '--signatures-file', type=argparse.FileType('r', encoding="utf8"), required=True)

args = parser.parse_args()


connection = pymysql.connect(host='localhost',
                             user='quotify',
                             password='secret', # ENTER CHANGED PASSWORD HERE
                             database='quotify',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

tagids = {}
authorids = {}
tagsignatureids = {}
authorsignatureids = {}

with connection, connection.cursor() as cursor:
    set_foreign_key_checks_sql = "SET FOREIGN_KEY_CHECKS = %s"

    try:
        cursor.execute("INSERT INTO signatures (`type`, `created_at`, `updated_at`) VALUES ('default', CURRENT_TIME(), CURRENT_TIME())")
        defaultsignatureid = getlastid(cursor)
    except Exception as e:
        defaultsignatureid = getexistingid(cursor, 'signatures', 'type', '=', 'default')

    signature_inserted = 0
    signature_existing = 0
    authors_inserted = 0
    quotes_inserted = 0
    tags_inserted = 0
    authors_existing = 0
    quotes_existing = 0
    tags_existing = 0

    for line in args.signatures_file:
        line = line.rstrip()
        [signaturetype, font_sz, stroke_width, letter_spacing, duration, color, authors] = line.split('|')
        try:
            cursor.execute("""
                INSERT INTO signatures (`type`, `font_size`, `stroke_width`, `letter_spacing`, `duration`, `color`, `created_at`, `updated_at`)
                VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIME(), CURRENT_TIME())
            """, (signaturetype, font_sz, stroke_width, letter_spacing, duration, color))

            lastid = getlastid(cursor)

            print(f"Signature '{signaturetype}' inserted...")
            signature_inserted += 1

        except Exception as e:
            print(f"Signature '{signaturetype}' already exists finding previous ID...")

            lastid = getlastid(cursor)
            signature_existing += 1

        for author in authors.split(','):
            authorsignatureids[author] = lastid

    for line in args.authors_file:
        line = line.rstrip()
        [author, wiki_link, description] = line.split('|')

        try:
            if author in authorsignatureids:
                signatureid = authorsignatureids[author]
            else:
                signatureid = defaultsignatureid
            cursor.execute("""
                INSERT INTO authors (`full_name`, `wiki_page`, `description`, `signature_id`, `created_at`, `updated_at`)
                VALUES (%s, %s, %s, %s, CURRENT_TIME(), CURRENT_TIME())
            """, (author, wiki_link, description, signatureid))

            authorids[author] = getlastid(cursor)
            print(f"Author '{author}' inserted...")
            authors_inserted += 1
        except Exception as e:
            print(f"Author '{author}' already exists finding previous ID...")
            authorids[author] = getexistingid(cursor, 'authors', 'full_name', '=', author)
            authors_existing += 1

    for line in args.quotes_file:
        line = line.rstrip()
        [quote, author, tags] = line.split('|')
        tags = tags.split(',')

        quotetagids = []

        for tag in tags:
            if (tag in tagids):
                quotetagids.append(tagids[tag])
                continue
            try:
                cursor.execute("INSERT INTO tags (`label`) VALUES (%s)", (tag))
                lastid = getlastid(cursor)
                tagids[tag] = lastid
                quotetagids.append(lastid)
                print(f"Tag '{tag}' inserted...")
                tags_inserted += 1
            except Exception as e:
                print(f"Tag '{tag}' already exists finding previous ID...")
                existingid = getexistingid(cursor, 'tags', 'label', '=', tag)
                tagids[author] = existingid
                quotetagids.append(existingid)
                tags_existing += 1
        try:
            cursor.execute("""
                INSERT INTO quotes (`quote`, `author_id`)
                VALUES (%s, %s)
            """, (quote, authorids[author]))
            quoteid = getlastid(cursor)
            quotes_inserted += 1
        except Exception as e:
            print(f"Quote already exists finding previous ID...")
            quoteid = getexistingid(cursor, 'quotes', 'quote', '=', quote)
            quotes_existing += 1

        for tagid in quotetagids:
            try:
                cursor.execute("INSERT INTO quote_tags (`quote_id`, `tag_id`) VALUES (%s, %s)", (quoteid, tagid))
                print(f"Added tag with id '{tagid}' to quote...")
            except Exception as e:
                print(f"Tag with id '{tagid}' already added to quote...")


    print(f"Found {authors_existing} existing authors")
    print(f"Added {authors_inserted} authors")
    print(f"Added {quotes_inserted} quotes")
    print(f"Found {quotes_existing} quotes")
    print(f"Added {tags_inserted} tags")
    print(f"Found {tags_existing} existing tags")
    print(f"Added {signature_inserted} signatures")
    print(f"Found {signature_existing} existing signatures")

    connection.commit()





