# Trakt Bulk Edit

A simple Angular application to manage your [Trakt.tv](https://trakt.tv) history.  
This tool allows you to bulk edit your watched history and resume points, making it easier to clean up your profile.

## 🛠️ Tech Stack

- **Framework**: Angular 21 (Standalone Components, Signals, Control Flow)
- **Styling**: Bootstrap 5, SCSS
- **State Management**: Angular Signals
- **API Integration**: Trakt.tv API, TMDB API via HttpClient
- **Deployment**: GitHub Actions (GitHub Pages)

## ⚙️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/YOUR_USERNAME/TraktBulkEdit.git
    cd TraktBulkEdit
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Secrets**  
    The application requires API keys to function. These are not committed to the repository for security.  
    Create a file named `secrets.json` in `src/assets/environment/`:

    ```bash
    mkdir -p src/assets/environment
    touch src/assets/environment/secrets.json
    ```

    Content of `src/assets/environment/secrets.json`:

    ```json
    {
      "traktClientId": "YOUR_TRAKT_CLIENT_ID",
      "traktClientSecret": "YOUR_TRAKT_CLIENT_SECRET",
      "tmdbApiKey": "YOUR_TMDB_API_KEY_OPTIONAL"
    }
    ```

    - **Trakt Keys**: Create an app at [Trakt API Apps](https://trakt.tv/oauth/applications). Set the Redirect URI to `http://localhost:4200/public/login`.
    - **TMDB Key**: Get an API Key from [TheMovieDB](https://www.themoviedb.org/settings/api) (Optional, for posters).

4.  **Run the application**
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

## 📦 Deployment

This project is configured to deploy automatically to **GitHub Pages** via GitHub Actions.

### Setup for GitHub Actions

To enable the automatic deployment, you need to add your API keys as Repository Secrets in GitHub:

1.  Go to your Repository **Settings** > **Secrets and variables** > **Actions**.
2.  Add the following secrets:
    - `TRAKT_CLIENT_ID`
    - `TRAKT_CLIENT_SECRET`
    - `TMDB_API_KEY`
3.  Push to the `main` branch. The Action will build the app, inject the secrets, and deploy to the `gh-pages` branch.

## 📝 License

This project is licensed under the MIT License.
