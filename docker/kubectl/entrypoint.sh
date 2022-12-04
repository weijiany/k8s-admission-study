#!/bin/sh
# Using sh rather than bash as this runs within the k3s container
set -eu

until kubectl get ns >/dev/null 2>/dev/null; do
  >&2 echo "Waiting for Kubernetes..."
  sleep 5
done

${@}
