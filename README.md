# Discourse-NFT-Badge-Plugin
This plugin will unlock badges in discourse based on badges owned by a user's address

## Discourse Badge Documentation:

https://meta.discourse.org/t/what-are-badges/32540

https://meta.discourse.org/t/grant-a-badge-to-individual-users-manually/29426

## Discourse development server usage:

Development server IP: 64.225.118.64
You will need a user account setup on the development server for you.
You will also need an admin account within the Discourse forum:
http://64.225.118.64:9292/

The plugin being developed in this repository is located at:
`/home/morgan/discourse/plugins/discourse-nft-badge`

From the plugin directory, use `git checkout <branch>` to checkout the branch of the repository you wish to test, and `git pull` to get the latest code.

Running/restarting the Discourse development server requires changing directory to: `/home/morgan/discourse`

After updating files in the `plugins` directory the Discourse container must be restarted.  If the unicorn process is running from the current shell, end it with `^c` and then delete the cache and restart the unicorn process:

```
rm -rf tmp/cache
d/unicorn -x
```

If you are not connected to the shell running unicorn, the container can instead be killed and restarted with:

```
d/shutdown_dev
rm -rf tmp/cache
d/unicorn -x
```

If running unicorn generates a dependency error, run:

```
d/shell
cd src
bundle install
exit
d/unicorn -x
```

After restarting the development container, reloading [the development site](http://64.225.118.64:9292/) in a web browser can be extremely slow and often fails due to time-outs at least once, requiring one or more page refreshes while the cache rebuilds.


## Discourse development server setup (Basic, using an existing server):

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

To create additional Discourse users, from the 'discourse' directory run:
```
d/shell
cd src
rake admin:create
### Fill in account details as prompted
exit
```

## Discourse development server setup (Complete Digital Ocean Ubuntu process):


- Deploy a Digital Ocean droplet running Ubuntu 18.04.
- Assign own SSH key for root access to server
- SSH in to NEW server as root:

Add primary user
```
adduser <USER>
usermod -aG sudo <USER>
```

Become primary user
```
su - <USER>
mkdir .ssh
```

To allow user to SSH into server, save their SSH public key into .ssh/authorized_keys using a text editor such as vim:
```
vim .ssh/authorized_keys
i <SSH_PUBLIC_KEY>
:wq
```

Install Docker, per https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04
```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
```

Add primary user to docker group
```
sudo usermod -aG docker ${USER}
su - ${USER}
```

Install Discourse development version, per https://github.com/andersonmmi/Discourse-NFT-Badge-Plugin#discourse-development-server-setup
```
git clone https://github.com/discourse/discourse.git
cd discourse
d/boot_dev --init
```

Create initial admin user as prompted, continue initialization:
```
d/shutdown_dev
d/boot_dev -p
d/unicorn -x
```

If there's a depencendy error when running "d/unicorn -x", resolve it with:
```
d/shell
cd src
bundle install
exit
d/unicorn -x
```


Install Discourse plugins
- If the unicorn daemon is running in the current process, exit it with: ^c
```
cd plugins
git clone https://github.com/andersonmmi/Discourse-NFT-Badge-Plugin.git
git clone https://github.com/morganstar/discourse-ethereum.git
git clone https://github.com/discourse/discourse-user-notes.git
git clone https://github.com/discourse/discourse-data-explorer.git
cd ..
d/unicorn -x
```

Access the site in a browser at it's IP address on port 9292; page load will probably time out and need to be repeated to build cache


If the unicorn daemon crashes with "out of memory" errors it may be necessary to enable swap space, per https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-18-04

Check if swap space is enabled:
```
sudo swapon --show
```

If that command has no result, swap isn't enabled, do this to enable it:
```
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Relaunch the unicorn daemon again:
```
d/unicorn -x
```








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


## Integrating the plugin with Metamask 

We will need to figure out the flow to allow a user to use their metamask accounts to link their addresses for badge redemption later. The current strategy is to leverage PluginStore for the list of addresses and otehr metadata, and then utilize user_custom_fields for the number of addresess they own.

Helpful Resources:

[Github REPO for Ethereum Plugin for Discourse](https://github.com/santiment/discourse-ethereum)

A plugin for integrating with your wallet via web 3, storing the address in user_custom_fields, and leverage some ethereum ruby gems to help send transcations through discourse!

[stackexchange link on verifying metamask account holder](https://ethereum.stackexchange.com/questions/35486/how-to-verify-metamask-account-holder-is-the-real-owner-of-the-address)

Seems useful for understanding the web 3 interactions with proving ownership of a metamask wallet. They mention generating a random nonce, then signing that nonce and return a JWT token.

## Redeem badge flow

Templates created:
```
templateId 0, name: dsrChallange, description: Challenge on DSR, image: dsrChallange.png
templateId 1, name: 3 months dsr locked, description: Locked in DSR for 3 months, image: https://image.com
templateId 2, name: Random2, description: Random Challange n. 2, image: random2.png
templateId 3, name: daiChallenge, description: Sent 10 Dai, image: daiChallenge.png
templateId 4, name: Random4, description: Random Challenge n. 4, image: random4.png
templateId 5, name: Random5, description: Random Challange n. 5, image: random5.png
templateId 6, name: Random6, description: Random Challange n. 6, image: random6.png
templateId 7, name: govChallenge, description: Vote on Governance Poll, image: govChallenge
```

Maker contract [here](https://kovan.etherscan.io/address/0x14D0DBd853923b856c000E4070631e4828E99DaE):
```
const addresses = {
  badgeFactory: {
    kovan: "0x14D0DBd853923b856c000E4070631e4828E99DaE",
    mainnet: ""
  },

```
Function to activate the badge:
```
  /// @notice Activate Badge by redeemers
  /// @dev Verify if the caller is a redeemer
  /// @param proof Merkle Proof
  /// @param templateId Template Id
  /// @param tokenURI Token URI
  /// @return _tokenId Token Id of the new Badge
  function activateBadge(bytes32[] memory proof, uint256 templateId, string memory tokenURI) public whenNotPaused returns (bool) {
    require(templates.length > templateId, "No template with that id");
    require(insignia.verify(templateId, msg.sender) || proof.verify(insignia.roots(templateId), keccak256(abi.encodePacked(msg.sender))), "Caller is not a redeemer");

```

Additional resources:<br/>
[Maker Badges Repo](https://github.com/naszam/maker-badges)<br/>
[Maker Certificates Repo](https://github.com/scottrepreneur/Certificates/tree/maker/Maker)<br/>

## Utilizing Discourse Plugin outlets to customize UI on discourse

It looks like we can use "plugin outlets" to enable modifying the UI of the app when the plugin is added. Heres some documentation on how to get that added for us:

Steps:

1 - Decide where in the UI we want adding addresses to surface - find the approximate template in the discourse source
[Link to Templates folder in discord git](https://github.com/discourse/discourse/tree/7a2e8d3ead63c7d99e1069fc7823e933f931ba85/app/assets/javascripts/discourse/app/templates)

option 1 - drop down under user<br/>
link - https://imgur.com/a/taPbWIr<br/>
[Source](https://github.com/discourse/discourse/blob/3d54f497db40575c996b4ef4374ccc44ba82f354/app/assets/javascripts/discourse/app/templates/user.hbs#L225) <br/>
discourse path = "/app/assets/javascripts/discourse/app/templates/user.hbs"

option 2 - Preferences hamburger stack on left<br/>
Link - https://imgur.com/a/ocLF326<br/>
[Source](https://github.com/discourse/discourse/blob/5bfe1ee4f1a2ae8a4188327b097a38c7f4ca0424/app/assets/javascripts/discourse/app/templates/preferences.hbs)<br/>
discouse path = "discourse/app/assets/javascripts/discourse/app/templates/preferences.hbs"

option 3- add a button to the "accounts" section in the preferences stack<br/>
Link - https://imgur.com/a/Zuf6SEu<br/>
[Source](https://github.com/discourse/discourse/blob/5bfe1ee4f1a2ae8a4188327b097a38c7f4ca0424/app/assets/javascripts/discourse/app/templates/preferences/account.hbs)<br/>
discourse path="discourse/app/assets/javascripts/discourse/app/templates/preferences/account.hbs". 

2 - Find the closest available plugin outlet

Inside these templates will have predefined locations where we can hook our plugin into. These are called plugin outlets, are located inside the handlebar templates, and have the following conventions :
```
{{plugin-outlet name="blah" }}
```
For instance, option 3 above has the following outlets available to us:
```
{{plugin-outlet name="user-preferences-account" args=(hash model=model save=(action "save"))}}
{{plugin-outlet name="user-custom-controls" args=(hash model=model)}}
```

3 - Create a handlebars template to connect into the plugin outlet

Lets assume we decided to use "user-custom-controls". First, lets create a new template to inject into the outlet, call it hello.hbs

```
<b>Hello World</b>
```

The key is to add this file to the below directory in the plugins repo. Note that the relative path is very similar to where the templates are in discourse, except these connector templates are placed in the /connectors/{name of plugin outlet}.

```
  plugin.rb			                     // main plugin file
  /assets
    /javascripts
      /discourse
        /templates
          /connectors
            /user-custom-controls 	 // same name as the plugin-outlet
              hello.hbs	             // inserted into site links

```

Finally, register the asset in plugin.rb if necessary:

```
register_asset "javascripts/discourse/templates/connectors/user-custom-controls/hello.hbs"
```

And that should be good!

Resources:

[Simple discourse plugin](https://www.sitepoint.com/community/t/a-simple-discourse-plugin/116302)<br/>
[introduction to plugin outlets](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-2-plugin-outlets/31001)<br/>
[sample plugin utilizing outlets to add a button](https://meta.discourse.org/t/add-a-button-at-the-bottom-of-a-topic-visible-to-a-specific-group-discourse-topic-group-button/36216)<br/>


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

