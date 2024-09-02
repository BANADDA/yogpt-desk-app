#!/bin/bash

# Function to check if git-lfs is installed
check_git_lfs() {
    if ! command -v git-lfs &> /dev/null; then
        echo "git-lfs could not be found, installing..."
        # Install git-lfs
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v sudo &> /dev/null; then
                curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
                sudo apt-get install git-lfs -y
            else
                curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
                apt-get install git-lfs -y
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install git-lfs
        elif [[ "$OSTYPE" == "msys" ]]; then
            echo "Please install Git LFS manually from https://git-lfs.github.com/"
            exit 1
        fi
        git lfs install
    else
        echo "git-lfs is already installed"
    fi
}

# Prompt the user for their username and password
read -p "Enter your username: " USERNAME
read -sp "Enter your password: " PASSWORD
echo

# Prompt the user for their environment preference
echo "Do you want to run the YoGPT miner on the local environment or use the RunPod environment?"
select env_choice in "Local" "RunPod"; do
    case $env_choice in
        Local ) 
            read -p "Enter the directory where you want the miner to run (press Enter to use the default path ~/myowngpt-miner): " MINER_DIR
            if [ -z "$MINER_DIR" ]; then
                MINER_DIR=~/myowngpt-miner
            fi

            # Execute commands locally
            if [ -d "$MINER_DIR" ]; then
                cd "$MINER_DIR"
                git reset --hard
                git pull
            else
                git clone https://github.com/bigideainc/myowngpt.git "$MINER_DIR"
                cd "$MINER_DIR/Backend/miner-program"
            fi

            # Check for and install git-lfs
            check_git_lfs

            # Check if the virtual environment exists
            if [ ! -d "venv" ]; then
                # Create a virtual environment
                python -m venv venv
            fi

            # Activate the virtual environment
            source venv/bin/activate

            # Upgrade pip
            pip install --upgrade pip

            # Install dependencies
            pip install -r requirements.txt

            # Run the training script
            python auth/trainer.py --username $USERNAME --password $PASSWORD
            break;;

        RunPod ) 
            # Prompt the user for their SSH details
            read -p "Enter your SSH details (e.g., root@38.147.83.27 -p 38**** -i ~/.ssh/id_ed25519): " SSH_DETAILS

            # Connect to the server via SSH and execute commands
            ssh -t $SSH_DETAILS "
            # Commands to be executed on the server
            if [ -d 'myowngpt-miner' ]; then
                cd myowngpt-miner/Backend/miner-program
                git reset --hard
                git pull
            else
                git clone https://github.com/bigideainc/myowngpt.git myowngpt-miner
                cd myowngpt-miner/Backend/miner-program
            fi

            # Check for and install git-lfs
            if ! command -v git-lfs &> /dev/null; then
                echo 'git-lfs could not be found, installing...'
                if command -v sudo &> /dev/null; then
                    curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
                    sudo apt-get install git-lfs -y
                else
                    curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
                    apt-get install git-lfs -y
                fi
                git lfs install
            else
                echo 'git-lfs is already installed'
            fi

            # Check if the virtual environment exists
            if [ ! -d 'venv' ]; then
                # Create a virtual environment
                python -m venv venv
            fi

            # Activate the virtual environment
            source venv/bin/activate

            # Upgrade pip
            pip install --upgrade pip

            # Install dependencies
            pip install -r requirements.txt

            # Run the training script
            python auth/trainer.py --username $USERNAME --password $PASSWORD
            "
            break;;
    esac
done
