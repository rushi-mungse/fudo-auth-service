## Fudo Food Delivery Application Backend

- Welcome to Fudo, a full-stack food delivery web application that leverages microservices architecture to provide a seamless and efficient experience for users. This README.md file provides an overview of the application's structure, technologies used, features, and guidance on setting up and deploying the application.

### Auth Service Routes

- send otp
- verify otp
- self
- logout
- login
- refresh
- forget password
- set password

#### Send Otp Route

- API end point - `post`

```terminal
api : http://localhost:5000/api/auth/send-otp
```

- Request

```ts
{
  fullName: string
  email: string
  password: string
  confirmPassword: string
}
```

- Response

```ts
{
  otpInfo: {
    fullName: string
    email: string
    hashOtp: string
  }
}
```

> Otp send by email

---

### Verify Otp Route

- API end point - `post`

```terminal
api : http://localhost:5000/api/auth/verify-otp
```

- Request

```ts
{
  fullName: string
  email: string
  hashOtp: string
  otp: string
}
```

- Response

```ts
{
  user: {
    _id: string
    fullName: string
    email: string
    password: string // hash password if you want's not send to response you can modify mongoDB query using populate
    role: string // default value customer
    status: string // default value valid
    updatedAt: string
    createdAt: string
  }
}
```

> set access token and refresh token as cookie

---

### Self Route (get self user data)

- API end point - `get`

```terminal
api : http://localhost:5000/api/auth/self
```

- Response

```ts
{
  user: userData
}
```

---

### Logout Route (logout user)

- API end point - `get`

```terminal
api : http://localhost:5000/api/auth/logout
```

---

### Login Route (login user)

- API end point - `post`

```terminal
api : http://localhost:5000/api/auth/login
```

- Request data

```ts
{
  email: string
  password: string
}
```

- Response

```ts
{
  user: userData
}
```

> set access token and refresh token cookies

---

### Refresh Route (refresh to get access token using refresh token)

- It's useful for auto authenticate user(auto login)

* API end point - `get`

```terminal
api : http://localhost:5000/api/auth/refresh
```

- Response

```ts
{
  user: userData
}
```

> set new access and refresh token

---

### Forget Password Route (forget user password if user logout)

- API end point - `post`

```terminal
api : http://localhost:5000/api/auth/forget-password
```

- Request

```ts
email: string
```

- Response

```ts
{
  otpInfo: {
    email: string
    hashOtp: string
    otp: string
  }
}
```

---

### Set Password (forget password set verify otp based)

- API end point - `post`

```terminal
api : http://localhost:5000/api/auth/set-password
```

- Request

```ts
email: string
opt: string
hashOtp: string
password: string // set new password
confirmPassword: string
```

- Response

```ts
user: UserData
```

> set new password not automaticaly login after set forget password

---