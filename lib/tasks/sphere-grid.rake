namespace :sphere do
  desc "Generates docker image"
  task dockerize: :environment do
    File.delete("Dockerfile") if File.exists?("Dockerfile")
    df = File.open("Dockerfile", "w")
    df.write <<-DOCKERFILE
FROM ruby:3.1.2

WORKDIR /app
COPY . /app

RUN RAILS_ENV=production bundle install
RUN RAILS_ENV=production rake assets:precompile

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

EXPOSE 3000

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true

ENTRYPOINT ["entrypoint.sh"]
CMD ["rails", "server", "-b", "0.0.0.0"]
    DOCKERFILE
    df.close

    build_command = [
      "docker",
      "build",
      "",
      ".",
      "--platform",
      "linux/amd64",
      "-f",
      "Dockerfile",
      "-t",
      "joevgreathead/sphere-grid:v0.1",
    ].join(" ")

    puts build_command
    `#{build_command}`

    File.delete("Dockerfile")
  end

end
