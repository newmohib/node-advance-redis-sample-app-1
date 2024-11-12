# AdvancedNodeStarter
Starting project for a course on Advanced Node @ Udemy

### Setup

- Run `npm install` in the root of the project to install server dependencies
- Change into the client directory and run `npm install --legacy-peer-deps`
- Change back into the root of the project and run `npm run dev` to start the server
- Access the application at `localhost:3000` in your browser

**Important:**
The credentials for the Mongo Atlas DB in `dev.js` are read only. If you attempt to log in without first adding your own connection string (covered later in the course) you will see an error: `[0] MongoError: user is not allowed to do action [insert] on [advnode.users]`

in react app with jest get an error 

 FAIL  tests/header.test.js
  ✓ Adds to numbers (4ms)
  ✕ We can launch a browser (98ms)

  ● We can launch a browser

    Failed to launch chrome!
    [1807:1807:1107/024632.510739:FATAL:zygote_host_impl_linux.cc(124)] No usable sandbox! Update your kernel or see https://chromium.googlesource.com/chromium/src/+/master/docs/linux_suid_sandbox_development.md for more information on developing with the SUID sandbox. If you want to live dangerously and need an immediate workaround, you can try using --no-sandbox.
