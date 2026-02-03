#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
ADMIN_EMAIL="admin_pdf2_$(date +%s)@example.com"
ADMIN_PASSWORD="SecurePassword123!"
PARTICIPANT_EMAIL="participant_pdf2_$(date +%s)@example.com"
PARTICIPANT_PASSWORD="SecurePassword123!"

echo ">>> Starting Verification Script for PDF Ticket (Attempt 2)"

# 1. Register and Login
echo ">>> Registering Admin & Participant..."
# Always try register, if fails (duplicate), login.
ADMIN_TOKEN=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\", \"name\": \"Admin\", \"role\": \"ADMIN\"}" | jq -r '.access_token')

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
    echo "   Admin registration failed/exists, logging in..."
    ADMIN_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}" | jq -r '.access_token')
fi

PARTICIPANT_TOKEN=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$PARTICIPANT_EMAIL\", \"password\": \"$PARTICIPANT_PASSWORD\", \"name\": \"Participant\", \"role\": \"PARTICIPANT\"}" | jq -r '.access_token')

if [ "$PARTICIPANT_TOKEN" == "null" ] || [ -z "$PARTICIPANT_TOKEN" ]; then
   echo "   Participant registration failed/exists, logging in..."
   PARTICIPANT_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\": \"$PARTICIPANT_EMAIL\", \"password\": \"$PARTICIPANT_PASSWORD\"}" | jq -r '.access_token')
fi

# 2. Create Event
echo ">>> Creating Event... with Token: ${ADMIN_TOKEN:0:10}..."
EVENT_RESPONSE=$(curl -s -X POST "$API_URL/events" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "PDF Test Event 2",
    "description": "Event for PDF test 2.",
    "date": "2026-12-31T20:00:00.000Z",
    "location": "Online",
    "capacity": 50
  }')
EVENT_ID=$(echo $EVENT_RESPONSE | jq -r '._id')

echo "   Event Created: $EVENT_ID"
if [ "$EVENT_ID" == "null" ]; then
    echo "   CRITICAL: Event creation failed. Response: $EVENT_RESPONSE"
    exit 1
fi

curl -s -X PATCH "$API_URL/events/$EVENT_ID/publish" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# 3. Create Reservation (Pending)
echo ">>> Creating Reservation (Pending)..."
RES_RESPONSE=$(curl -s -X POST "$API_URL/reservations" \
  -H "Authorization: Bearer $PARTICIPANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"eventId\": \"$EVENT_ID\"}")
RES_ID=$(echo $RES_RESPONSE | jq -r '._id')
echo "   Reservation Created: $RES_ID"

# 4. Attempt Download (Should Fail)
echo ">>> Attempting Download (Pending - Should Fail)..."
FAIL_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/reservations/$RES_ID/ticket" \
  -H "Authorization: Bearer $PARTICIPANT_TOKEN")

if [ "$FAIL_CODE" == "400" ]; then
  echo "SUCCESS: Download blocked for pending reservation (400)."
else
  echo "FAILURE: Download status $FAIL_CODE (Expected 400)."
fi

# 5. Confirm Reservation
echo ">>> Confirming Reservation..."
curl -s -X PATCH "$API_URL/reservations/$RES_ID/confirm" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# 6. Attempt Download (Should Succeed)
echo ">>> Attempting Download (Confirmed - Should Succeed)..."
curl -s -D headers.txt -o ticket_test.pdf -X GET "$API_URL/reservations/$RES_ID/ticket" \
  -H "Authorization: Bearer $PARTICIPANT_TOKEN"

HTTP_CODE=$(grep "HTTP/1.1" headers.txt | awk '{print $2}')
CONTENT_TYPE=$(grep -i "Content-Type" headers.txt | awk '{print $2}')

if [ "$HTTP_CODE" == "200" ] && [[ "$CONTENT_TYPE" == *"application/pdf"* ]]; then
  echo "SUCCESS: Download successful (200 OK, application/pdf)."
  FILE_SIZE=$(wc -c < ticket_test.pdf)
  echo "PDF Size: $FILE_SIZE bytes"
  rm ticket_test.pdf headers.txt
else
  echo "FAILURE: Download failed. Code: $HTTP_CODE, Type: $CONTENT_TYPE"
  cat headers.txt
fi

echo ">>> Verification Complete"
