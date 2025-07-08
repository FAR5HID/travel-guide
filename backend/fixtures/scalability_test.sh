#!/bin/bash

URL="http://localhost:8000/api/route/"
PAYLOAD="scalability_test_payload.json"
TOTAL=100

echo -e "\nExecuting scalability_test.sh using Apache Benchmark (ab)...\n"
echo -e "Concurrency\tRequests/sec\tTime per request (ms)"
for CONC in 10 50 100
do
    OUT=$(ab -n $TOTAL -c $CONC -p "$PAYLOAD" -T application/json "$URL" 2>/dev/null)
    REQ_PER_SEC=$(echo "$OUT" | grep "Requests per second" | awk '{print $4}')
    TIME_PER_REQ=$(echo "$OUT" | grep "Time per request" | awk 'NR==2{print $4}')
    echo -e "$CONC\t\t$REQ_PER_SEC\t\t$TIME_PER_REQ"
done
echo -e "\nScalability test completed.\n"