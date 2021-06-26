build:
	docker build -t action/action-io .

serve:
	docker run -v ${PWD}:/app -v ${PWD}/vendor/bundle:/usr/local/bundle -p 4000:4000 -it --rm --name action-io action/action-io
