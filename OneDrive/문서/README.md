# Penguin & Pukuli — Customizable Birthday Website ♡

A responsive, pastel-pink birthday surprise website for Penguin / Pukuli, with a story, photo gallery, editable notes, an animated envelope letter, and a final birthday screen.

## Run it
1. Download and unzip this folder.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.
3. Tap **Customize this surprise** to edit the nickname, date, signature, final message, letter, notes, photo captions, and accent color.
4. Tap photo cards in the gallery to select pictures from your device.

No build tools, backend, or database are required.

## Customize everything in the editor
- **Basics:** nickname, signature, birthday date, final message, accent color.
- **Notes:** edit any note, add more notes, or remove notes.
- **Photos:** choose pictures and edit captions.
- **Letter:** edit the heading and full letter text. Separate paragraphs with a blank line.
- **Gallery:** click the cards on the gallery page to add photos.
- **Reset:** the editor's reset button restores the original sample text.

## Make changes directly in the files
- `index.html` — sections and page structure.
- `style.css` — colors, fonts, spacing, responsive design, animations.
- `script.js` — default text and interactive behavior. The `DEFAULTS` object near the top is the main place to edit the default birthday content.
- `assets/` — place your own assets here if you want to reference files by path.

## Important photo and save behavior
- Text settings are saved in the browser's local storage on the device where you edit them.
- Photos you select are shown in the current page session and are not uploaded to a server. Refreshing the page may clear the selected photos.
- The browser editor does not change the files in this ZIP or the deployed website's source files. To make your edited content the permanent starting content for everyone, update `DEFAULTS` in `script.js` and the photo defaults/markup in `index.html`, then redeploy.
- Avoid entering private information you don't want visible to anyone who can open the site.

## Publish it on Vercel
1. Create a Git repository and add `index.html`, `style.css`, `script.js`, `README.md`, and `assets/`.
2. Import the repository into Vercel.
3. Deploy as a static site. No build command is needed.
4. After publishing, share the generated site link.

You can also use the VS Code Live Server extension to preview changes locally.
