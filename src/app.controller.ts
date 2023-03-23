import { Body, Controller, Post } from '@nestjs/common';

const NGINX_PROXY_KEY = 'k8s-admission-study/proxy';

const base64 = (o: Record<any, any>): string =>
  Buffer.from(JSON.stringify(o)).toString('base64');

const nginxProxyPatchObj = (op: string, index: number): Record<any, any> => ({
  op: op,
  path: `/spec/template/spec/containers/${index}`,
  value: {
    name: 'nginx-proxy',
    image: 'nginx:1.23.2',
    ports: [{ containerPort: 80 }],
  },
});

@Controller()
export class AppController {
  @Post('/mutate')
  getHello(@Body() body: Record<any, string>): Record<any, any> {
    const uid = body['request']['uid'];
    const proxyIndex = this.proxyIndex(body);
    const enableProxy = Boolean(
      body['request']['object']['metadata']['annotations'][NGINX_PROXY_KEY],
    );

    let op: Record<string, any>;
    if (enableProxy) {
      if (proxyIndex === -1) {
        op = nginxProxyPatchObj('add', -1);
      } else {
        op = nginxProxyPatchObj('replace', proxyIndex);
      }
    } else {
      op = nginxProxyPatchObj('remove', proxyIndex);
    }

    return {
      apiVersion: 'admission.k8s.io/v1',
      kind: 'AdmissionReview',
      response: {
        uid,
        allowed: true,
        patchType: 'JSONPatch',
        patch: base64([op]),
      },
    };
  }

  proxyIndex(body: Record<any, any>): number {
    const containers =
      body['request']['object']['spec']['template']['spec']['containers'];
    return containers
      .map((container) => container['name'])
      .indexOf('nginx-proxy');
  }
}
