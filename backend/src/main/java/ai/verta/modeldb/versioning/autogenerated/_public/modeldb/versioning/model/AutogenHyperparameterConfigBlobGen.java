// THIS FILE IS AUTO-GENERATED. DO NOT EDIT
package ai.verta.modeldb.versioning.autogenerated._public.modeldb.versioning.model;

import ai.verta.modeldb.versioning.*;
import ai.verta.modeldb.versioning.blob.diff.*;
import com.pholser.junit.quickcheck.generator.*;
import com.pholser.junit.quickcheck.generator.java.util.*;
import com.pholser.junit.quickcheck.random.*;
import java.util.*;

public class AutogenHyperparameterConfigBlobGen extends Generator<AutogenHyperparameterConfigBlob> {
  public AutogenHyperparameterConfigBlobGen() {
    super(AutogenHyperparameterConfigBlob.class);
  }

  @Override
  public AutogenHyperparameterConfigBlob generate(SourceOfRandomness r, GenerationStatus status) {
    // if (r.nextBoolean())
    //     return null;

    AutogenHyperparameterConfigBlob obj = new AutogenHyperparameterConfigBlob();
    if (r.nextBoolean()) {
      obj.setName(Utils.removeEmpty(new StringGenerator().generate(r, status)));
    }
    if (r.nextBoolean()) {
      obj.setValue(
          Utils.removeEmpty(
              gen().type(AutogenHyperparameterValuesConfigBlob.class).generate(r, status)));
    }
    return obj;
  }
}
