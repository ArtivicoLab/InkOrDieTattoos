# Ink Or Die Tattoos - Studio Website

Professional website for Ink Or Die Tattoos, a Black-owned, Indigenous-owned, female-owned tattoo studio located in Decatur, Georgia.

## Features

- **Floating Gallery**: Animated showcase of authentic tattoo artwork
- **Real-Time Status**: Live business hours with open/closed indicator
- **Portfolio Section**: Complete gallery with professional descriptions
- **Social Sharing**: Instagram and platform integration for portfolio sharing
- **Mobile Responsive**: Optimized for all devices and screen sizes
- **Accessibility**: Screen reader friendly with keyboard navigation
- **Custom 404**: Beautiful error page matching studio branding

## Studio Information

**Ink Or Die Tattoos**
- 📍 3407 Covington Dr, Decatur, GA 30032
- 📞 (404) 555-1234
- 🏳️‍🌈 LGBTQ+ Friendly & Transgender Safe Space
- ♿ Wheelchair Accessible with Gender-Neutral Restrooms
- 👑 Black-Owned, Indigenous-Owned, Female-Owned

**Business Hours:**
- Tuesday - Friday: 11AM - 8PM
- Saturday: 11AM - 8PM  
- Sunday: 1PM - 6PM
- Monday: 11AM - 8PM

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with animations and responsive design
- **Images**: Optimized JPEG portfolio with lazy loading
- **Hosting**: Static site deployment ready

## File Structure

```
├── index.html              # Main website page
├── styles.css              # All styling and animations
├── main.js                 # JavaScript functionality
├── 404.html               # Custom error page
├── images/
│   ├── tattoos/           # Floating gallery images
│   └── card-gallery/      # Portfolio gallery images
└── README.md              # This file
```

## Adding New Tattoo Images

### Floating Gallery (Hero Section)
1. Add images to `images/tattoos/` folder
2. Name files: `tattoo-description.jpeg`
3. Update image list in `main.js` (line ~40)

### Portfolio Gallery
1. Add images to `images/card-gallery/` folder  
2. Use descriptive names like:
   - `detailed-portrait-work.jpeg`
   - `vibrant-color-design.jpeg`
   - `black-gray-masterpiece.jpeg`
   - `geometric-precision.jpeg`

The system automatically generates professional titles and descriptions from filenames.

## Customization

- **Colors**: Update CSS variables in `styles.css` (line ~80)
- **Business Info**: Edit contact details in `index.html`
- **Social Links**: Modify sharing buttons and links
- **Hours**: Update business hours in `main.js` business hours section

## Deployment

This is a static website that can be deployed to:
- Replit Deployments
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Support

For technical support or website updates, contact your web developer.

---

**Ink Or Die Tattoos** - Where artistry meets skin. ✨