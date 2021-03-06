build:
	rm -rf backend/build && rm -rf client/build && yarn --cwd client build && cp -R client/build backend/build

build-docker: build
	docker build -t docker.pkg.github.com/sonac/triplan/triplan .

docker-login:
	cat ~/.git_token | docker login https://docker.pkg.github.com -u sonac --password-stdin

ci-docker-login:
	docker login https://docker.pkg.github.com -u sonac --password ${{ secrets.GITHUB_TOKEN }}

publish: build-docker
	docker push docker.pkg.github.com/sonac/triplan/triplan:latest

pull: docker-login
	docker pull docker.pkg.github.com/sonac/triplan/triplan:latest