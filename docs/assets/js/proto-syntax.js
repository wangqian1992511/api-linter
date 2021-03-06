// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Ex post facto improvements to protobuf syntax highlighting.
// This applies special CSS classes to protobuf patterns that are overlooked
// or insufficiently distinguished by the usual Pygments/Rouge syntax parsers.
$.when($.ready).then(() => {
  // RPCs are always followed by three names (the RPC name, the request object,
  // and the response object) -- designate those appropriately.
  $('.language-proto .k:contains(rpc)').each((_, el) => {
    $(el)
      .nextAll('.n')
      .slice(1, 3)
      .addClass('nc');
  });

  // Designate message names as such when using them to delcare fields.
  $('.language-proto .n + .na + .o:contains(=)')
    .prev()
    .prev()
    .addClass('nc');

  // Colons in protocol buffers always come immediately after property keys.
  $('.language-proto .n + .o:contains(:)')
    .addClass('nk')
    .prev()
    .addClass('nk');

  // The option keyword is always followed by the annotation name.
  $('.language-proto .k:contains(option)').each((_, el) => {
    $(el)
      .nextAll('.n')
      .eq(0)
      .addClass('protobuf-annotation');
  });

  // Highlight correct and incorrect proto code blocks.
  for (let desc of ['Correct', 'Incorrect']) {
    let magic = `// ${desc}.\n`;
    $(`.language-proto .c1:first-child:contains('${magic}')`).each((_, el) => {
      let text = $(el).text();

      // Sanity check. This has to be the leading text.
      if (!text.startsWith(magic)) {
        return null;
      }

      // Hide the comment and add the CSS class to create the border.
      $(el)
        .addClass('hide-screen')
        .parents('.language-proto')
        .addClass(`api-linter-${desc.toLowerCase()}`);

      // If there is any other text, add it to a new comment <span> so it
      // is not hidden.
      if (text != magic) {
        $(el).after(
          $(`<span class="c1">${text.substring(magic.length)}</span>`)
        );
      }
    });
  }
});
