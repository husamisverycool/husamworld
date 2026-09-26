#!/bin/sh
# assemble world/bill.html from the parts; keeps the shared world-nav block from the current page
cd /home/user/husamworld/world
NAV=$(sed -n '/<!-- world-nav:start -->/,/<!-- world-nav:end -->/p' bill.html)
[ -z "$NAV" ] && NAV=$(sed -n '/<!-- world-nav:start -->/,/<!-- world-nav:end -->/p' _explore/bill/nav.html)
printf '%s\n' "$NAV" > _explore/bill/nav.html
{ cat _explore/bill/final-head.html _explore/bill/final-body.html _explore/bill/final-js.html; printf '%s\n' "$NAV"; echo '</body>'; echo '</html>'; } > bill.html.new && mv bill.html.new bill.html
wc -c bill.html
