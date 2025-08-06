## Client side

- [x] Adding a search bar in the collections page
- [x] Remove whishlist button from single product page
- [x] About Our Collection - Schedule a consultation button - Discuss with sanjay - removed from ui
- [x] Join our circle - mail handling - Discuss with sanjay
- [x] FAQ | Shipping & Returns | Privacy Policy | Terms & Conditions - handling
- [x] Update contact details and social media links in the Footer
- [x] Scroll to FAQ position from footer
- [x] Shopping cart shipping charge slider animation
- [x] Collections pagination numbers border smoothen
- [x] Added to cart toast not showing inside the collections page
- [x] Image zooming effect in the single product view screen
- [x] Contacts page images and contents and map
- [x] Contact us form handling
- [x] Related items clicking not directing to the product in single product view
- [x] Folder and files restructuring and deleting old files
- [x] Birthday notes page
  - [x] Showing the birthday details in the order screen
- [x] Logout functionality
- [x] Redirect to homepage on accessing logged in pages without loggin in
- [x] About us youtube - dynamic
- [x] Show subtotal in checkout page
- [x] Close button in the payment dialog
- [x] Orders success notification
- [x] Add delivery address in the orders page
- [x] Fix dependency issue
- [x] Click logo to redirect to homepage
- [x] If already added product in the cart, add to cart should
  - [x] Increase the quantity instead of adding a new product
  - [x] Incase of birthday notes just change the birthday date
- [x] Navbar and banner ui fix in mobile view
- [x] Remove toast from all api call failures
- [x] Sell to us page
- [x] Handle product quantity selection based on stock availability
- [x] On Stock empty products show a dialog to add their mail to send notification later
- [ ] Logo - discuss with sanjay
- [ ] Refactor api calling to services
- [ ] Handle remember me in login

## Backend side

- [x] Handle GST in product adding
- [x] Handling mailer
- [x] Handling jwt authentication for getting orders - get user id from the jwt token
  - [x] Don't pass userId in the request use the auth token instead
- [x] Invoice generation - Failing issue and gst issue calculation
- [x] Sell to us form submission mail handling
- [x] Adding watermark in image upload
- [x] Birthday notes handling in product
- [x] Remove total from the add order request body
- [ ] Product id field in product upload
- [ ] Check excel and invoice export in real device
- [x] First time admin order failing check
- [ ] Low stock notifications cron job
  - [x] Currently added once the user purchases a product
- [x] Check product stock decrement after user purchases a product
- [x] Stock update alert to the user

## App side

- [x] Handle jwt token authentication for admin
- [x] Handle GST in product upload and Order summary
- [x] Add Orders screen nav from side navbar
- [x] Remove default details from the add orders page
- [x] Alter login page with new ui
- [x] Handle product quantity selection based on stock availability
- [x] Change primary theme color
- [ ] Handle product id in product upload
- [x] Show proper dialog content on order
- [x] Low stock notifications after user purchases a product
- [x] Handling role based views for admin
  - [x] Super Admin
    - admins - add | delete
    - products - add | edit | delete
    - sub categories - add | delete
    - orders - view | add | add discount | download report
    - announcement - add | edit | delete
    - video banner - add | edit | delete
    - analytics - view
  - [x] Admin
    - admins - no access
    - products - add | edit | delete
    - sub categories - add | delete
    - orders - view | add | download report
    - announcement - add | edit | delete
    - video banner - add | edit | delete
    - analytics - view
  - [x] Moderator
    - admins - no access
    - products - add | edit
    - sub categories - add | delete
    - orders - only view
    - announcement - no access
    - video banner - no access
    - analytics - no access | remove analytics from home page
  - [x] Logout from super admin and login as moderator shows the admin section in side nav
  - [ ] Remove logs

## Addons

- Handle local db for storing products and orders
- Use sync based updates to the admin and update the only the new data and show the old data from local storage
- Improve the analytics section in the admin app
- Change different font for website
- Sending subscribers mail
- Settings page for handling notifications on/off
- Better home page for moderator ( show an arrow to the add the product towards floating action button)
- Birthday date selection in the birthday notes order for admin app
- Authentication
  - [ ] Otp verification for signup
  - [ ] Forgot password
  - [ ] Handle refresh token and access token
  - [ ] Handle remember me in login
  - [ ] Handle JWT token expiration
  - [ ] Handle role in JWT token
- Add chucker and send debug logs to the server
- Sending news letter to subscribers with just text

## Talk with sanjay

- Join our collections circle
- FAQ | Shipping & Returns | Privacy Policy | Terms & Conditions
- Contact details / office address - (avadi | chennai)
- Logo

- [x] Handle bank transfer details in the payment page
- [x] Order id - ORD + 6 digits - sequence
- [x] Collections - Shop / Store
- [x] Sell to us - separate page
- [x] Requirements page - separate page
- [x] Wishlist
- Profile page -
  - [x] Change password
  - [x] Update profile
  - [x] My orders
  - [x] My wishlist
- [x] Search by tags, country, continent
- [x] Order invoice ui
- [x] categories page - ui
- [x] Logout reload the page and go to home page
- [ ] Images - from sanjay
- [ ] Content verification from sanjay

  - [x] Deliver period - shipping period
  - [x] Custom tags
  - [x] Detailed product view in tablet view
  - [x] Order status Payment pending, Processing, Completed/Shipped, Cancelled
  - [x] Update tracking number in the order
  - [x] Handle backpress in homepage - dont go to login page
