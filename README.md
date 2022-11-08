# Lendsqr Backend Assessment

Demo Credit is a wallet service API for Lendsqr backend interview test

<br>

## Installation 💻

Here is the Live [API](https://successchukwu-lendsqr-be-test.herokuapp.com/) hosted at Heroku

Visit the url and be pleased 💪🏾

<br>

## API Endpoints 🔗

Here is a copy of the [postman collection](https://successchukwu.postman.co/workspace/Personal-Workspace-APIs~d5101cdd-522b-4cae-84e1-aff298415f1b/collection/18382461-0d735682-9fd2-490d-991a-d89c6f142e7a?action=share&creator=18382461), all endpoint calls and responses are there, please refer to that.

Incase you're having issues opening the link to postman or you find it hard to understand, I've also kept this for reference purposes.
<br>
Thank you 💯😇

<br>

# Endpoints Documentation 📚

A complete listing of endpoints, parameters and body for an easier consumption of the API.

<br>

Postman Environments

```
baseURL = 'http://localhost:8500/api/v1'
LGDIN_USRTKN = "user's signed in token"
```

### Authorization Type:

```
Bearer Token
```

<br>

## Modules 📦

<br>

### Authentication Module (Bearer Token: "None")

<br>

Sign Up <br>

##### NOTE: User's valid phone number will be modified as primary account number.

<br>

- POST: `{{baseURL}}/signup` <br>
  BODY

```json
{
	"fullname": "Success Chukwu",
	"email": "iamcusicon@gmail.com",
	"phone": "2348118362567",
	"password": "081456",
	"pin": "1234"
}
```

<br>

Sign In

- POST: `{{baseURL}}/signin` <br>
  BODY

```json
{
	"account_no": 8118362567,
	"password": "081456"
}
```

<br>

### Transaction Module (Bearer Token: "JWTAccessToken")

<br>
User viewing all their transactions

- GET: `{{baseURL}}/transactions`

<br>

### Deposit Module (Bearer Token: "JWTAccessToken")

<br>

User depositing to their wallet (a.k.a money from another user) <br>

##### NOTE: This will return user's account details

<br>

- GET: `{{baseURL}}/deposit`

<br>

### Withdrawal Module (Bearer Token: "JWTAccessToken")

<br>

Fetch user's account name to verify provided account number before transfer

- GET: `{{baseURL}}/withdraw/:account_number/account_name` <br>
  PARAMS - Path variables

```text
account_number:8118362567
```

<br>

User withdrawing from their wallet (a.k.a sending money to another user)

- POST: `{{baseURL}}/withdraw` <br>
  BODY

```json
{
	"amount": 1000.0,
	"bank": "STERLING BANK",
	"account_no": "0501044555",
	"account_name": "SUCCESS CHUKWU",
	"description": "Cashback",
	"auth_pin": "1234"
}
```

<br>
<br>

## Enjoy 🥳💪🏾

I'm pretty sure you'll love what I did.

<br>

## Author 🧑🏾‍💻😁

[Success Chukwu](https://iam.successchukwu.com)<br>
iamcusicon@gmai.com
