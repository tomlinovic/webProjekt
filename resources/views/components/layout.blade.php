<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
@vite('resources/css/app.css')
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
</head>
<body>

<div class="grid-container">

<div class="header"><h1>AniProgress</h1></div>

<div class="menu">
  <ul>
    <a href="/"><li>Home</li></a>
    @if(Auth::check())
     <a href="/my-anime"><li>My anime</li></a>
    <a href="/friends"><li>Friends</li></a>
    <li><form method="POST" action="/logout">@csrf<button>Logout</button></form></li>
    @else
        <a href="/login"><li>Login</li></a>
        <a href="/register"><li>Register</li></a>
    @endif
    <a href="/literatura"><li>Literatura</li></a>
  </ul>
</div>

<div class="content">
  {{ $slot}}
</div>  

<div class="facts">
  <div id="friend-progress-box"></div>
  <p>
  Track your anime progress, follow friends, and see who is ahead or behind in every series. 
Share episode thoughts, avoid spoilers, and stay connected with your anime community.
  </p>
</div>

<div class="footer"><p>Track your and your friends anime progress.</p></div>
  
</div>

</body>
</html>


