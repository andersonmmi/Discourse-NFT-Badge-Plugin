# Discourse-NFT-Badge-Plugin
This plugin will unlock badges in discourse based on badges owned by a user's address

## Discourse Badge Documentation:

https://meta.discourse.org/t/what-are-badges/32540

https://meta.discourse.org/t/grant-a-badge-to-individual-users-manually/29426

## Discourse development server setup:

Development server IP: 64.225.118.64

[Beginners guild to install Discourse for Development Using Docker](https://meta.discourse.org/t/beginners-guide-to-install-discourse-for-development-using-docker/102009)

NOTE: Getting the development server running can require a fair amount of fiddling.  Once running it will be accessible via IP on port 9292.

Enable firewall to allow incoming traffic on port 9292.

To download, configure, and launch run:

```
git clone https://github.com/discourse/discourse.git
cd discourse
d/boot_dev --init
d/shutdown_dev
d/boot_dev -p
d/unicorn -x
```

Sometimes a new container will fail to launch with an error similar to:

```
Could not find minitest-5.14.1 in any of the sources
Run `bundle install` to install missing gems.
```
To resolve an error like that, run:

```
d/shutdown_dev
d/boot_dev -p
d/shell
cd src
bundle install
exit
d/unicorn -x
```

Plugins can be developed/loaded by placing them in the `plugins` directory and then restarting the container.  If the unicorn process is running in a current shell, end it with `^c` and then delete the cache and restart the unicorn process:

```
rm -rf tmp/cache
d/unicorn -x
```

If you are not connected to the shell running unicorn, the container can instead be killed and restarted with:

```
d/shutdown_dev
rm -rf tmp/cache
d/boot_dev -p
d/unicorn -x
```

After restarting the development container, reloading the site in a web browser can be extremely slow and often fails at least once, requiring one or more page refreshes.

##  Discourse production-style server setup:

Requires:
- mailgun.com account
- digitalocean.com account
- A domain or sub-domain name.

Create new Digital Ocean droplet.

Enable firewall on droplet through digital ocean.  Open ports 80 and 443 to incoming traffic.

Edit DNS record to point a (sub-)domain name to the droplet's IP address.

Installed Docker on Digital Ocean droplet per "Step 1 - Installing Docker" from:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04

Install Discourse production environment as root to /var/discourse following all steps from:
https://www.digitalocean.com/community/tutorials/how-to-install-discourse-on-ubuntu-18-04

- This clones discourse_docker (the production environment for Discourse) into /var/discourse
- During setup use SMTP settings provided by Mailgun.
- After setup completes a docker container will be automatically built, which can take several minutes.
- When finished the Discourse container should be running.
- The final step is accessing the Discourse web app from a web browser and setting an admin account.


## Developing Discourse plugins:

[Lots of example Discourse plugins, for reference](https://github.com/discourse/all-the-plugins/tree/master/plugins)

[Beginners Guide to Creating Discourse Plugins](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-1/30515)

[Plugin Generator](https://meta.discourse.org/t/rails-plugin-generator/95907)
Running this tool requires opening a shell INTO the Discourse development container and navigating to /src. It was used to generate the skeleton for this plugin by running:

```
d/shell
cd /src
rails g plugin DiscourseNftBadge
exit
```

The generated files are saved to `plugins/discourse-nft-badge` 

[Plugin Coding Tutorial](https://kleinfreund.de/how-to-create-a-discourse-plugin/)
NOTE: There seem to be some bugs within the code from this tutorial, use with caution. (The plugin installs successfully, but the /notebook page does not render as expected)

[Guide to installing plugins in Discourse (applies to Production discourse_docker style installs)](https://meta.discourse.org/t/install-plugins-in-discourse/19157/215)

Adding a plugin ("discourse-user-notes" plugin in this example) from a github repository:

Edit `/var/discourse/containers/app.yml`, modify the section titled "Plugins go here" by adding a line at the end to clone the git repository of the desired plugins.  If no other plugins have been installed yet it should look like this. (Note that on some installations the line with "docker_manager.git" may start with "sudo -E -u discourse", leave it as is):

```
## Plugins go here
## see https://meta.discourse.org/t/19157 for details
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/discourse/discourse-user-notes.git
```

After editing app.yml, rebuild the container (the forum will go down, rebuild takes a few minutes, the forum automatically restarts when done):

`./launcher rebuild app`


## Different Discourse repositories:

### discourse/discourse.git
Development oriented for building and testing Discourse containers.

Runs on port 9292 as a user (though user needs docker permission and possibly sudo permission).

Install guide: https://meta.discourse.org/t/beginners-guide-to-install-discourse-for-development-using-docker/102009

### discourse/discourse_docker.git:
Production environment and default containers for running Discourse.

Runs on ports 80 and 443 as root.

Installs inside `/var/discourse/`.

Install guide: https://www.digitalocean.com/community/tutorials/how-to-install-discourse-on-ubuntu-18-04

The name for the Discourse Docker container that is run automatically is "app".

The directory /var/discourse/shared/ gets mapped inside of the Discourse container to /shared/ - files in the actual directory can be accessed from within the container.

Inside the container, the Discourse installation is located at /var/www/discourse/

View container logs:
    ./launcher logs <my_container>

Spawn a shell inside container:
    ./launcher enter <my_contaner>


NOTE: It may be possible to deploy a new plugin to /var/discourse/shared/ and then using a shell into the Discourse Docker container, create a symlink from /shared/<PLUGIN> to /var/www/discourse/plugins/<PLUGIN>


## False leads:

Setting up PostFix or other email solution on development server is an unnecessary complication for purposes of developing a plugin. Just use MailGun.

On a server where docker has already been setup to work with one user, creating a new user to run discourse.git (development version) can lead to permission issues, where the docker instance attempts to create files as the wrong user. Ex. 'bob' has sudo permission and installs Docker on the server and adds himself to the 'docker' group. A new user, 'alice', is created and clones the 'discourse.git' repository.  When 'alice' runs the initialization scripts they attempt to create directories and files owned by 'bob', causing permissions failures preventing completing execution (under normal circumstances).

Found in discourse_dev notes:

'Note that the discourse user is granted "sudo" permission without asking for a password in the discourse_dev image.  This is to facilitate the command-line Docker tools in discourse proper that run commands as the discourse user.'

