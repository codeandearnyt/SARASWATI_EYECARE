# Verified Clinic Video Sources

The official Saraswati Eye Care Centre YouTube channel (`@saraswatieyecarecentre6185`) publishes the real videos used for the Video page. The following current entries were verified from the channel on 22 August 2026; their thumbnail assets are supplied directly by YouTube.

| Video ID | Published title | Duration | Thumbnail |
|---|---|---:|---|
| `cAtNadhm0Uc` | Myopia – Is Your Vision at Risk? | 7:39 | `https://i.ytimg.com/vi/cAtNadhm0Uc/hq720.jpg` |
| `0XILC7RSc0g` | जब LASIK Surgery संभव न हो, तो घबराने की आवश्यकता नहीं। | 4:46 | `https://i.ytimg.com/vi/0XILC7RSc0g/hq720.jpg` |
| `R_84fIlWqxo` | Myopia in kids explained by Dr. Khushboo Gupta | 5:41 | `https://i.ytimg.com/vi/R_84fIlWqxo/hq720.jpg` |
| `e80ZY4bwvQE` | आँखों की रौशनी ही नहीं, ज़िंदगी को भी रोशन करता है Saraswati Eye Care Centre | 1:50 | `https://i.ytimg.com/vi/e80ZY4bwvQE/hq720.jpg` |
| `qJtzwMhX8YE` | अब मोतियाबिंद का इलाज आसान और सुरक्षित! | 5:48 | `https://i.ytimg.com/vi/qJtzwMhX8YE/hq720.jpg` |
| `fRlWgvoY5j0` | Role of AI in IOL Selection for Cataract Patients | 6:56 | `https://i.ytimg.com/vi/fRlWgvoY5j0/hq720.jpg` |
| `hJr2OcPPToE` | Cataract: symptoms, treatment options and types of IOL | 9:28 | `https://i.ytimg.com/vi/hJr2OcPPToE/hq720.jpg` |
| `mGu0hqoljlU` | बच्चों में मायोपिया: कारण, लक्षण, बचाव व इलाज | 10:29 | `https://i.ytimg.com/vi/mGu0hqoljlU/hq720.jpg` |

The production page should embed these by ID through the YouTube no-cookie domain and retain a direct source-channel link.

## Implementation validation

On 22 August 2026, the eight verified YouTube thumbnails were copied to managed web storage and connected to the public Video page. Each card opens a responsive `youtube-nocookie.com` iframe for its matching official video ID, with a direct YouTube watch fallback. The first privacy-enhanced embed endpoint returned HTTP 200 during validation. Desktop and 375 px mobile visual checks confirmed the original thumbnails, cards, and responsive player container render as intended. A Chromium mobile-browser interaction check also opened the first card’s real player and confirmed the shared menu retained a fixed `top: 68px` position before and after scrolling.
