// route to get profile info => /profile
router.get('/profile', async (req,res, next) => {
    console.log(req.headers);
    let userToken = req.headers.auth;
    console.log(userToken);
  
    if(userToken){
      let currentUser = await tokenService.verifyToken(userToken);
      console.log(currentUser);
  
      if(currentUser){
        // ROUTE LOGIC GOES HERE SEE EXAMPLE BELOW
        // let responseUser = {
        //   firstName: currentUser.firstName,
        //   lastName: currentUser.lastName,
        //   email: currentUser.email,
        //   username: currentUser.username
        }
        res.json({
          message: 'User Profile info loaded successfully',
          status: 200,
          user: responseUser
        })
      }
      else{
        res.json({
          message: 'Token was invalid or expired',
          status: 403,
        })
      }
    }
    else{
      res.json({
        message: 'No token received',
        status: 403,
      })
    }
  })